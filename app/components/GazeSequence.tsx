"use client";

import { useEffect, useRef, useState } from "react";

/**
 * GazeSequence: a transparent portrait whose head turns toward the cursor,
 * in any direction.
 *
 * The frames are cut-out WebP images (alpha, no background), so the figure
 * sits on whatever the page color is. They hold four short turns back to
 * back, each running from a forward-facing pose to a full turn: look left,
 * look right, look up, look down. The cursor's position relative to the
 * head picks the dominant direction and how far to turn. Switching direction
 * eases the head back through center first, the way a real head moves.
 *
 * Frames are preloaded and drawn to a canvas, so every "seek" is instant and
 * it works the same in every browser (transparent video is not).
 *
 * Touch devices and reduced-motion users get the first frame only; the rest
 * are never downloaded for them.
 */
export type Direction = "left" | "right" | "up" | "down";

type Props = {
  /** Frame URL for index i, e.g. (i) => `/hero-gaze/f${i}.webp`. */
  frameSrc: (i: number) => string;
  frameCount: number;
  width: number;
  height: number;
  /** Inclusive frame ranges, [facing forward, full turn]. */
  segments: Record<Direction, [number, number]>;
  /** Where the head sits inside the element, as fractions (0 to 1). */
  headAnchor?: { x: number; y: number };
  /** 0.02 to 1. Higher is snappier. */
  smoothing?: number;
  /** Cursor distance (0 to 1) below which the head faces forward. */
  deadzone?: number;
  label: string;
  className?: string;
};

export function GazeSequence({
  frameSrc,
  frameCount,
  width,
  height,
  segments,
  headAnchor = { x: 0.5, y: 0.2 },
  smoothing = 0.14,
  deadzone = 0.06,
  label,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !ctx) return;

    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let canDraw = false;

    const k = Math.min(1, Math.max(0.02, smoothing));
    let targetDir: Direction = "left";
    let targetMag = 0;
    let dir: Direction = "left";
    let mag = 0;
    let drawn = -1;
    let raf = 0;

    const draw = (i: number) => {
      const img = images[i];
      if (!img || i === drawn) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      drawn = i;
    };

    // Preload and decode every frame before taking over from the static one.
    Promise.all(
      Array.from({ length: frameCount }, (_, i) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(i);
        images[i] = img;
        return img.decode().catch(() => {});
      }),
    ).then(() => {
      if (cancelled) return;
      draw(segments.left[0]);
      canDraw = true;
      setReady(true);
    });

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
      if (canDraw) {
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
        draw(Math.round(a + mag * (b - a)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Face forward again when the cursor leaves the window.
    const onLeave = () => { targetMag = 0; };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, frameSrc, frameCount, width, height, smoothing, deadzone, headAnchor.x, headAnchor.y, segments]);

  return (
    <div ref={rootRef} className={`relative h-full w-full ${className}`}>
      {/* The forward-facing frame: shown until the rest are ready, and the
          whole experience on touch devices. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frameSrc(segments.left[0])}
        alt={label}
        width={width}
        height={height}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: ready ? 0 : 1 }}
      />
      {enabled && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
