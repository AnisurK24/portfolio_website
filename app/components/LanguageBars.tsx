"use client";

import { useState } from "react";
import type { LanguageShare } from "@/app/lib/github";

// One series (share of code), so every bar takes the same hue and the
// labels carry identity. Hovering a row shows the raw size.
export function LanguageBars({ languages }: { languages: LanguageShare[] }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...languages.map((l) => l.share));

  return (
    <figure>
      <ul className="grid gap-3" aria-label="Share of code across public repositories, by language">
        {languages.map((l) => {
          const pct = Math.round(l.share * 1000) / 10;
          const on = active === l.name;
          return (
            <li
              key={l.name}
              onPointerEnter={() => setActive(l.name)}
              onPointerLeave={() => setActive(null)}
              className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 text-[15px]"
            >
              <span className="truncate font-medium">{l.name}</span>
              <span className="relative h-3">
                <span
                  className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[filter] duration-150"
                  style={{
                    width: `${Math.max((l.share / max) * 100, 1.5)}%`,
                    background: l.name === "Other" ? "color-mix(in oklab, currentColor 35%, transparent)" : "var(--color-coral)",
                    filter: on ? "brightness(1.12)" : undefined,
                  }}
                />
                {on && (
                  <span className="pointer-events-none absolute -top-9 left-0 whitespace-nowrap rounded-lg bg-[var(--color-ink)] px-2.5 py-1 text-[13px] text-[var(--color-paper)] shadow-lg ring-1 ring-white/10">
                    {l.name}: {(l.bytes / 1024).toFixed(0)} KB of code
                  </span>
                )}
              </span>
              <span className="text-right tabular-nums">{pct}%</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="muted mt-4 text-xs">
        Public repositories only, by code size. Most of my professional Java and TypeScript lives in private repos.
      </figcaption>
    </figure>
  );
}
