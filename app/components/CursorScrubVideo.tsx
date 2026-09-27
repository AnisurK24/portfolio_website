"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorScrubVideo: a muted video whose playhead follows the cursor.
 * It never plays on its own; moving the cursor scrubs through it.
 *
 * For smooth scrubbing the video must be encoded with every frame as a
 * keyframe, otherwise each seek decodes from the previous keyframe and
 * stutters. Encode with:
 *
 *   ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 18 -g 1 -keyint_min 1 \
 *     -x264-params "scenecut=0" -profile:v high -pix_fmt yuv420p \
 *     -movflags +faststart -an out.mp4
 *
 * On touch devices (no hover) and with reduced motion, it shows the poster
 * only and never downloads the video.
 */
type Props = {
  src: string;
  poster?: string;
  axis?: "horizontal" | "vertical";
  reverse?: boolean;
  trackingArea?: "component" | "window";
  /** 0.02 to 1. Higher is snappier, lower has more inertia. */
  smoothing?: number;
  objectFit?: "cover" | "contain" | "fill";
  showPoster?: boolean;
  borderRadius?: number;
  /** 0 to 1: where the playhead rests before the cursor moves. */
  initialProgress?: number;
  className?: string;
  videoClassName?: string;
  label: string;
};

export function CursorScrubVideo({
  src,
  poster,
  axis = "horizontal",
  reverse = false,
  trackingArea = "component",
  smoothing = 0.22,
  objectFit = "cover",
  showPoster = true,
  borderRadius = 0,
  initialProgress = 0,
  className = "",
  videoClassName = "",
  label,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  // Decide once on the client whether this device should scrub at all.
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
    const start = Math.min(1, Math.max(0, initialProgress));
    let target = 0;
    let current = 0;
    let moved = false;
    let seeking = false;
    let canScrub = false;
    let raf = 0;

    const onSeeking = () => { seeking = true; };
    const onSeeked = () => { seeking = false; };
    const onReady = () => {
      if (!moved && Number.isFinite(video.duration)) {
        target = current = start * video.duration;
        video.currentTime = current;
      }
      canScrub = true;
      setReady(true);
    };

    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("canplaythrough", onReady, { once: true });

    // Load, then a silent play/pause so the browser buffers decodable frames.
    video.load();
    video.play().then(() => video.pause()).catch(() => {});
    video.currentTime = 0;

    const onMove = (e: PointerEvent) => {
      let x: number;
      let y: number;
      if (trackingArea === "window") {
        x = e.clientX / window.innerWidth;
        y = e.clientY / window.innerHeight;
      } else {
        const r = root.getBoundingClientRect();
        x = (e.clientX - r.left) / r.width;
        y = (e.clientY - r.top) / r.height;
      }
      let pos = axis === "horizontal" ? x : y;
      pos = Math.min(1, Math.max(0, pos));
      if (reverse) pos = 1 - pos;
      if (Number.isFinite(video.duration)) {
        target = pos * video.duration;
        moved = true;
      }
    };

    const tick = () => {
      if (canScrub && Number.isFinite(video.duration)) {
        current += (target - current) * k;
        if (!seeking && Math.abs(video.currentTime - current) > 0.008) {
          video.currentTime = current;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const area: Window | HTMLElement = trackingArea === "window" ? window : root;
    area.addEventListener("pointermove", onMove as EventListener, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", onMove as EventListener);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("canplaythrough", onReady);
    };
  }, [enabled, axis, reverse, trackingArea, smoothing, initialProgress]);

  const radius = { borderRadius };

  return (
    <div ref={rootRef} className={`relative h-full w-full overflow-hidden ${className}`} style={radius}>
      {/* Poster: always rendered, so the first frame shows while the video buffers,
          and it is the whole experience on touch devices. */}
      {(showPoster || !enabled) && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={label}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${videoClassName}`}
          style={{ objectFit, opacity: ready ? 0 : 1, ...radius }}
        />
      )}
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
          className={`absolute inset-0 h-full w-full ${videoClassName}`}
          style={{ objectFit, ...radius }}
        />
      )}
    </div>
  );
}
