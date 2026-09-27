"use client";

import { useEffect, useState } from "react";

// Third hero line. Server-renders the first phrase in full, then starts
// retyping after the entrance settles. Screen readers get the static list.
export function HeroTyper({ phrases }: { phrases: string[] }) {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(phrases[0].length);
  const [phase, setPhase] = useState<"hold" | "delete" | "type">("hold");
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setLive(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!live) return;
    const current = phrases[idx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "hold") {
      t = setTimeout(() => setPhase("delete"), 1900);
    } else if (phase === "delete") {
      if (count > 0) t = setTimeout(() => setCount((c) => c - 1), 32);
      else
        t = setTimeout(() => {
          setIdx((i) => (i + 1) % phrases.length);
          setPhase("type");
        }, 180);
    } else {
      if (count < current.length) t = setTimeout(() => setCount((c) => c + 1), 62);
      else t = setTimeout(() => setPhase("hold"), 0);
    }
    return () => clearTimeout(t);
  }, [live, phase, count, idx, phrases]);

  return (
    <>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden className="inline-flex items-baseline">
        <span>{phrases[idx].slice(0, count)}</span>
        <span className="hero-caret ml-[0.04em] inline-block h-[0.78em] w-[0.07em] translate-y-[0.02em] bg-current" />
      </span>
    </>
  );
}
