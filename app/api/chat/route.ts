import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { ANISUR_CONTEXT } from "@/app/lib/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
const RATE_LIMIT_PER_HOUR = Number(process.env.CHAT_RATE_LIMIT_PER_HOUR ?? "20");
const HOUR_MS = 60 * 60 * 1000;

type Bucket = { count: number; resetAt: number };
const rateLimitStore = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const bucket = rateLimitStore.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + HOUR_MS });
    return { allowed: true, remaining: RATE_LIMIT_PER_HOUR - 1, resetAt: now + HOUR_MS };
  }
  if (bucket.count >= RATE_LIMIT_PER_HOUR) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count += 1;
  return {
    allowed: true,
    remaining: RATE_LIMIT_PER_HOUR - bucket.count,
    resetAt: bucket.resetAt,
  };
}

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Chat is not configured. ANTHROPIC_API_KEY is missing on the server.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    const minutes = Math.ceil((limit.resetAt - Date.now()) / 60000);
    return new Response(
      JSON.stringify({
        error: `Rate limit reached. Try again in ${minutes} minutes.`,
      }),
      {
        status: 429,
        headers: {
          "content-type": "application/json",
          "x-ratelimit-reset": String(limit.resetAt),
        },
      },
    );
  }

  let body: { messages?: ClientMessage[] } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const incoming = body.messages ?? [];
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Trim to last 10 turns to keep tokens bounded.
  const trimmed = incoming.slice(-10).map((m) => ({
    role: m.role,
    content: String(m.content ?? "").slice(0, 4000),
  }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: ANISUR_CONTEXT,
          messages: trimmed,
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n[error: ${message}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-ratelimit-remaining": String(limit.remaining),
    },
  });
}
