"use client";

import { ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

/**
 * GlowCard tracks the cursor position over its bounds and exposes it as
 * CSS custom properties (--x and --y) for use by the `.card-glow::before`
 * radial gradient defined in globals.css.
 *
 * Uses pointer events for performance and falls back gracefully if pointer
 * events are unavailable.
 */
export function GlowCard({ children, as = "div", className = "" }: Props) {
  // `as` is intentionally wide in the public API, but `keyof
  // IntrinsicElements` spans SVG elements too, and JSX intersects props
  // across the whole union, which no single handler can satisfy. Narrowing
  // to one HTML tag internally keeps the call sites flexible while giving
  // the element a concrete type. Only getBoundingClientRect and style are
  // used below, so any HTML element behaves identically at runtime.
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--x", "50%");
    el.style.setProperty("--y", "50%");
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`card-glow ${className}`}
    >
      {children}
    </Tag>
  );
}
