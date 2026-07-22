"use client";

import { useEffect, useState } from "react";

type Props = {
  phrases: string[];
  typeSpeedMs?: number;
  deleteSpeedMs?: number;
  holdMs?: number;
  className?: string;
};

type Phase = "typing" | "holding" | "deleting";

export function Typewriter({
  phrases,
  typeSpeedMs = 55,
  deleteSpeedMs = 30,
  holdMs = 1800,
  className = "",
}: Props) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced motion preference. Render static if user prefers.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return;

    const current = phrases[phraseIdx % phrases.length] ?? "";
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (charCount < current.length) {
        timer = setTimeout(() => setCharCount((c) => c + 1), typeSpeedMs);
      } else {
        timer = setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      if (charCount > 0) {
        timer = setTimeout(() => setCharCount((c) => c - 1), deleteSpeedMs);
      } else {
        timer = setTimeout(() => {
          setPhraseIdx((i) => (i + 1) % phrases.length);
          setPhase("typing");
        }, 0);
      }
    }

    return () => clearTimeout(timer);
  }, [phrases, phraseIdx, charCount, phase, reducedMotion, typeSpeedMs, deleteSpeedMs, holdMs]);

  if (reducedMotion || phrases.length === 0) {
    return <span className={className}>{phrases[0] ?? ""}</span>;
  }

  const text = (phrases[phraseIdx % phrases.length] ?? "").slice(0, charCount);

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="typewriter-caret" />
      <style jsx>{`
        .typewriter-caret {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          margin-left: 2px;
          vertical-align: text-bottom;
          background: var(--color-accent);
          animation: tw-blink 1s steps(2, end) infinite;
        }
        @keyframes tw-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
