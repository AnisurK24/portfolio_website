"use client";

import { useEffect, useRef, useState } from "react";

/**
 * GazeVideo: a portrait video whose head turns toward the cursor, in any
 * direction.
 *
 * The video holds four short segments back to back, each running from a
 * forward-facing pose to a full turn: look left, look right, look up, look
 * down. The cursor's position relative to the head picks the dominant
 * direction and how far to turn. Switching direction eases the head back
 * through center first, the way a real head moves.
 *
 * Encode every frame as a keyframe so seeks land instantly:
 *   ffmpeg ... -c:v libx264 -g 1 -keyint_min 1 -x264-params "scenecut=0" -an out.mp4
 *
 * Touch devices and reduced-motion users get the poster only; the video is
 * never downloaded for them.
 */
export type Direction = "left" | "right" | "up" | "down";

type Props = {
  src: string;
  poster: string;
  /** Inclusive frame ranges within the video, [facing forward, full turn]. */
  segments: Record<Direction, [number, number]>;
  fps: number;
  /** Where the head sits inside the element, as fractions (0 to 1). */
  headAnchor?: { x: number; y: number };
  /** 0.02 to 1. Higher is snappier. */
  smoothing?: number;
  /** Cursor distance (0 to 1) below which the head faces forward. */
  deadzone?: number;
  label: string;
  className?: string;
  mediaClassName?: string;
};

export function GazeVideo({
  src,
  poster,
  segments,
  fps,
  headAnchor = { x: 0.5, y: 0.2 },
  smoothing = 0.14,
  deadzone = 0.06,
  label,
  className = "",
  mediaClassName = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    const k = Math.min(1, Math.max(0.02, smoothing));
    // Seek to the middle of a frame so rounding never lands on its neighbor.
    const frameTime = (f: number) => (f + 0.5) / fps;

    let targetDir: Direction = "left";
    let targetMag = 0;
    let dir: Direction = "left";
    let mag = 0;
    let seeking = false;
    let canSeek = false;
    let raf = 0;

    const onSeeking = () => { seeking = true; };
    const onSeeked = () => { seeking = false; };
    const onReady = () => {
      video.currentTime = frameTime(segments.left[0]);
      canSeek = true;
      setReady(true);
    };
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("canplaythrough", onReady, { once: true });
    video.load();
    video.play().then(() => video.pause()).catch(() => {});

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const hx = r.left + r.width * headAnchor.x;
      const hy = r.top + r.height * headAnchor.y;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Normalize by the room available on each side of the head, so the
      // screen edge always means a full turn.
      const dx = e.clientX - hx;
      const dy = e.clientY - hy;
      const nx = dx < 0 ? dx / Math.max(1, hx) : dx / Math.max(1, w - hx);
      const ny = dy < 0 ? dy / Math.max(1, hy) : dy / Math.max(1, h - hy);
      const ax = Math.min(1, Math.abs(nx));
      const ay = Math.min(1, Math.abs(ny));
      if (Math.max(ax, ay) < deadzone) {
        targetMag = 0;
        return;
      }
      // Hysteresis on the diagonal: keep the current axis unless the other
      // one clearly wins, so the head doesn't flicker between sideways and up.
      const horizontalNow = targetDir === "left" || targetDir === "right";
      if (horizontalNow ? ax * 1.15 >= ay : ax > ay * 1.15) {
        targetDir = nx < 0 ? "left" : "right";
        targetMag = ax;
      } else {
        targetDir = ny < 0 ? "up" : "down";
        targetMag = ay;
      }
    };

    const tick = () => {
      if (canSeek) {
        if (targetDir !== dir) {
          // Return through center before turning another way.
          mag += (0 - mag) * Math.min(1, k * 1.6);
          if (mag < 0.03) {
            mag = 0;
            dir = targetDir;
          }
        } else {
          mag += (targetMag - mag) * k;
        }
        const [a, b] = segments[dir];
        const frame = Math.round(a + mag * (b - a));
        const t = frameTime(frame);
        if (!seeking && Math.abs(video.currentTime - t) > 0.5 / fps) {
          video.currentTime = t;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    // Face forward again when the cursor leaves the window.
    const onLeave = () => { targetMag = 0; };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("canplaythrough", onReady);
    };
  }, [enabled, fps, smoothing, deadzone, headAnchor.x, headAnchor.y, segments]);

  return (
    <div ref={rootRef} className={`relative h-full w-full ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={label}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${mediaClassName}`}
        style={{ opacity: ready ? 0 : 1 }}
      />
      {enabled && (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
        />
      )}
    </div>
  );
}
