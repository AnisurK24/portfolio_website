"use client";

import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react";

export type Skill = { name: string; proof: string; where: string };

// Big typographic index. Each skill opens to the place it was proven.
export function Skills({ items }: { items: Skill[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="border-t border-[color-mix(in_oklab,currentColor_18%,transparent)]">
      {items.map((s, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        return (
          <li
            key={s.name}
            className="group border-b border-[color-mix(in_oklab,currentColor_18%,transparent)]"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
            >
              <span
                className={`display text-[clamp(1.9rem,5.2vw,4.25rem)] transition-[color,transform] duration-300 ease-[var(--ease-out-strong)] ${
                  isOpen ? "text-[var(--color-coral)] md:translate-x-3" : "group-hover:md:translate-x-3"
                }`}
              >
                {s.name}
              </span>
              <Plus
                size={28}
                aria-hidden
                className={`shrink-0 transition-transform duration-300 ease-[var(--ease-out-strong)] ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-2 pb-7 md:grid-cols-[1fr_minmax(0,38rem)] md:gap-10 md:pl-3">
                  <p className="muted text-sm font-medium">{s.where}</p>
                  <p className="text-lg leading-relaxed md:text-xl">{s.proof}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
