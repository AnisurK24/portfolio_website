"use client";

import { useState } from "react";
import type { FrameworkCount, LanguageShare } from "@/app/lib/github";

// One series (share of code), so every bar takes the same hue and the
// labels carry identity. Hovering a row shows the raw size.
export function LanguageBars({ languages, frameworks = [] }: { languages: LanguageShare[]; frameworks?: FrameworkCount[] }) {
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
      {frameworks.length > 0 && (
        <div className="mt-7">
          <h4 className="text-sm font-semibold">Frameworks &amp; runtimes</h4>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Frameworks and runtimes detected in public repositories">
            {frameworks.map((f) => (
              <li
                key={f.name}
                className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,currentColor_22%,transparent)] px-3.5 py-1.5 text-[15px] font-medium"
              >
                {f.name}
                <span className="muted text-[13px] tabular-nums">
                  {f.repos} repo{f.repos === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <figcaption className="mt-5 grid gap-2 text-sm leading-relaxed">
        <span className="muted">Languages by code size; Node.js and React code counts as JavaScript. Mostly App Academy projects.</span>
        <span>
          Professionally I shipped <strong className="font-semibold">Java (Spring)</strong> backends and{" "}
          <strong className="font-semibold">React/TypeScript</strong> frontends at CRETelligent, and{" "}
          <strong className="font-semibold">Node.js</strong> services on contract. Those codebases are private;{" "}
          <a href="#stack" className="underline decoration-[var(--color-coral)] decoration-2 underline-offset-4 hover:decoration-current">see the full stack</a>.
        </span>
      </figcaption>
    </figure>
  );
}
