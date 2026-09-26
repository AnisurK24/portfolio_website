"use client";

import { useMemo, useRef, useState } from "react";
import type { ContributionDay } from "@/app/lib/github";

// Sequential scale, one hue: coral mixed into the section ground, dim to
// bright. Level 0 is a faint neutral so empty days still read as cells.
const LEVEL_FILL = [
  "color-mix(in oklab, currentColor 9%, transparent)",
  "color-mix(in oklab, var(--color-coral) 42%, transparent)",
  "color-mix(in oklab, var(--color-coral) 62%, transparent)",
  "color-mix(in oklab, var(--color-coral) 82%, transparent)",
  "var(--color-coral)",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function label(day: ContributionDay) {
  const dt = parse(day.date);
  const when = dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const n = day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`;
  return `${n} on ${when}`;
}

export function ContributionHeatmap({ days }: { days: ContributionDay[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Columns are weeks (Sunday first), padded so the first column starts on Sunday.
  const weeks = useMemo(() => {
    const lead = parse(days[0].date).getUTCDay();
    const cells: (ContributionDay | null)[] = [...Array(lead).fill(null), ...days];
    const out: (ContributionDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [days]);

  const monthLabels = useMemo(() => {
    let last = -1;
    return weeks.map((w) => {
      const first = w.find(Boolean);
      if (!first) return "";
      const m = parse(first.date).getUTCMonth();
      if (m === last) return "";
      last = m;
      return MONTHS[m];
    });
  }, [weeks]);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) {
      const k = d.date.slice(0, 7);
      map.set(k, (map.get(k) ?? 0) + d.count);
    }
    return [...map.entries()];
  }, [days]);

  function show(e: React.PointerEvent | React.FocusEvent, day: ContributionDay) {
    const cell = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const box = scroller.current!.parentElement!.getBoundingClientRect();
    setTip({ text: label(day), x: cell.left - box.left + cell.width / 2, y: cell.top - box.top });
  }

  return (
    <figure className="relative">
      {/* rtl scroller + ltr grid: on narrow screens it opens at the most recent weeks. */}
      <div ref={scroller} dir="rtl" className="overflow-x-auto pb-2 [scrollbar-width:thin]">
        <div
          dir="ltr"
          role="img"
          aria-label={`Contribution calendar, ${days[0].date} to ${days[days.length - 1].date}. Monthly totals are in the table that follows.`}
          className="grid min-w-[720px] gap-[3px]"
          style={{ gridTemplateColumns: `28px repeat(${weeks.length}, minmax(0, 1fr))` }}
          onPointerLeave={() => setTip(null)}
        >
          {/* Month labels */}
          <span />
          {monthLabels.map((m, i) => (
            <span key={`m-${i}`} className="muted h-5 overflow-visible whitespace-nowrap text-xs leading-5">
              {m}
            </span>
          ))}

          {/* Rows: Sun..Sat, labels on Mon/Wed/Fri */}
          {Array.from({ length: 7 }, (_, row) => (
            <Row key={row} row={row} weeks={weeks} onShow={show} onHide={() => setTip(null)} />
          ))}
        </div>
      </div>

      {tip && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-lg bg-[var(--color-ink)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-paper)] shadow-lg ring-1 ring-white/10"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="muted">Includes contributions to private repositories.</span>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="muted mr-1">Less</span>
          {LEVEL_FILL.map((f, i) => (
            <span key={i} className="h-3 w-3 rounded-[3px]" style={{ background: f }} />
          ))}
          <span className="muted ml-1">More</span>
        </span>
      </figcaption>

      <table className="sr-only">
        <caption>Contributions per month</caption>
        <thead>
          <tr><th scope="col">Month</th><th scope="col">Contributions</th></tr>
        </thead>
        <tbody>
          {monthly.map(([k, v]) => (
            <tr key={k}><td>{k}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Row({
  row,
  weeks,
  onShow,
  onHide,
}: {
  row: number;
  weeks: (ContributionDay | null)[][];
  onShow: (e: React.PointerEvent | React.FocusEvent, d: ContributionDay) => void;
  onHide: () => void;
}) {
  const dayLabel = row === 1 ? "Mon" : row === 3 ? "Wed" : row === 5 ? "Fri" : "";
  return (
    <>
      <span className="muted text-[11px] leading-none self-center">{dayLabel}</span>
      {weeks.map((w, i) => {
        const d = w[row];
        if (!d) return <span key={i} />;
        return (
          <span
            key={d.date}
            tabIndex={-1}
            aria-label={label(d)}
            onPointerEnter={(e) => onShow(e, d)}
            onFocus={(e) => onShow(e, d)}
            onBlur={onHide}
            className="aspect-square rounded-[3px] transition-[outline-color] duration-150 hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-[var(--color-paper)]"
            style={{ background: LEVEL_FILL[d.level] }}
          />
        );
      })}
    </>
  );
}
