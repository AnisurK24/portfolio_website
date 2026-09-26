"use client";

import { useEffect, useRef } from "react";

// Hero portrait with a small pointer parallax. Position is eased toward the
// pointer each frame and written straight to the transform, so React never
// re-renders while the mouse moves.
export function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -18;
      ty = (e.clientY / window.innerHeight - 0.5) * -10;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="h-full w-full will-change-transform">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/portrait-cutout.webp"
        alt="Anisur Khan smiling, in a black jacket and tan quarter-zip sweater"
        width={846}
        height={1600}
        fetchPriority="high"
        className="portrait-in h-full w-full object-contain object-right-bottom"
      />
    </div>
  );
}
