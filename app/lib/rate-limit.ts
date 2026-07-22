// Rate limiting for the chat endpoint.
//
// The previous implementation kept counters in a module-level Map. That
// works on a long-lived server and not at all on serverless: each
// instance has its own memory, instances scale out under load, and cold
// starts wipe the counters. The advertised "20 per hour" was really "20
// per instance until it recycled", on a public endpoint spending real
// money per request.
//
// Netlify Blobs gives every instance the same store. The in-memory path
// is kept as a fallback so that if the store is unavailable the endpoint
// degrades to the old behaviour rather than failing open entirely or
// throwing.

import { getStore } from "@netlify/blobs";

const HOUR_MS = 60 * 60 * 1000;

export type RateLimitBackend = "blobs" | "memory";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  /** Which store answered. Surfaced as a response header for debugging. */
  backend: RateLimitBackend;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/** Fallback only. See the note above about why this is not sufficient alone. */
const memoryStore = new Map<string, Bucket>();

function bump(bucket: Bucket | undefined, now: number, limit: number): {
  bucket: Bucket;
  result: Omit<RateLimitResult, "backend">;
} {
  if (!bucket || bucket.resetAt < now) {
    const fresh = { count: 1, resetAt: now + HOUR_MS };
    return {
      bucket: fresh,
      result: { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt },
    };
  }

  if (bucket.count >= limit) {
    return {
      bucket,
      result: { allowed: false, remaining: 0, resetAt: bucket.resetAt },
    };
  }

  const next = { count: bucket.count + 1, resetAt: bucket.resetAt };
  return {
    bucket: next,
    result: { allowed: true, remaining: limit - next.count, resetAt: next.resetAt },
  };
}

function checkInMemory(key: string, limit: number, now: number): RateLimitResult {
  const { bucket, result } = bump(memoryStore.get(key), now, limit);
  memoryStore.set(key, bucket);
  return { ...result, backend: "memory" };
}

export async function checkRateLimit(key: string, limit: number): Promise<RateLimitResult> {
  const now = Date.now();

  try {
    // Strong consistency is required, not a preference. The default is
    // eventual, under which a read can miss the write from the request
    // immediately before it, so every caller sees a fresh bucket and the
    // limit never engages.
    const store = getStore({ name: "chat-rate-limits", consistency: "strong" });
    const existing = (await store.get(key, { type: "json" })) as Bucket | null;
    const { bucket, result } = bump(existing ?? undefined, now, limit);

    // Only write when the count changed. A blocked caller does not need
    // a write, which keeps a hammering client from generating store
    // traffic proportional to its own abuse.
    if (result.allowed) {
      await store.setJSON(key, bucket);
    }

    return { ...result, backend: "blobs" };
  } catch {
    return checkInMemory(key, limit, now);
  }
}
