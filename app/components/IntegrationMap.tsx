"use client";

import { useEffect, useRef, useState } from "react";

type NodeDef = { id: string; label: string; angle: number };

// Every system here is one Anisur has shipped against (see app/lib/context.ts).
const NODES: NodeDef[] = [
  { id: "salesforce", label: "Salesforce", angle: -90 },
  { id: "hubspot", label: "HubSpot", angle: -58 },
  { id: "quire", label: "Quire", angle: -28 },
  { id: "infinitecampus", label: "Infinite Campus", angle: 2 },
  { id: "regrid", label: "Regrid", angle: 32 },
  { id: "claude", label: "Claude API", angle: 58 },
  { id: "mailgun", label: "Mailgun", angle: 92 },
  { id: "pendo", label: "Pendo", angle: 122 },
  { id: "netsuite", label: "NetSuite", angle: 150 },
  { id: "schoolmint", label: "SchoolMint", angle: 180 },
  { id: "quickbooks", label: "QuickBooks", angle: 208 },
  { id: "usaepay", label: "USAePay", angle: 232 },
];

export type Specialty = {
  title: string;
  body: string;
  nodes: string[] | "all";
};

// Two geometries: the phone layout is taller with larger type, so labels
// stay readable once the 640-unit viewBox shrinks to a narrow screen.
// On phones the systems sit in two columns beside the hub instead of on an
// ellipse, which leaves room for long labels at a readable size.
const WIDE = { W: 640, H: 600, RX: 214, RY: 250, font: 15, charW: 9.2, padX: 34, pillH: 38, hub: 78, hubFont: 17, hubSub: 13, columns: false };
const NARROW = { W: 640, H: 820, RX: 200, RY: 0, font: 20, charW: 11.8, padX: 36, pillH: 48, hub: 84, hubFont: 22, hubSub: 16, columns: true };
type Geo = typeof WIDE;

const round = (n: number) => Math.round(n * 100) / 100;

function nodePos(g: Geo, angle: number, i = 0) {
  if (g.columns) {
    const half = Math.ceil(NODES.length / 2);
    const left = i < half;
    const slot = left ? i : i - half;
    const count = left ? half : NODES.length - half;
    const top = 70;
    const span = g.H - 140;
    const y = top + (count === 1 ? span / 2 : (span * slot) / (count - 1));
    return { x: g.W / 2 + (left ? -g.RX : g.RX), y: round(y) };
  }
  const r = (angle * Math.PI) / 180;
  // Rounded so server and browser float math produce identical markup.
  return { x: round(g.W / 2 + g.RX * Math.cos(r)), y: round(g.H / 2 + g.RY * Math.sin(r)) };
}

function curve(g: Geo, x: number, y: number) {
  const CX = g.W / 2;
  const CY = g.H / 2;
  // Gentle bow: control point pushed perpendicular to the spoke.
  const mx = (CX + x) / 2;
  const my = (CY + y) / 2;
  const dx = x - CX;
  const dy = y - CY;
  const len = Math.hypot(dx, dy) || 1;
  const bow = 26;
  return `M ${CX} ${CY} Q ${round(mx - (dy / len) * bow)} ${round(my + (dx / len) * bow)} ${x} ${y}`;
}

export function IntegrationMap({ specialties }: { specialties: Specialty[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [active, setActive] = useState(0);
  const [motionOk, setMotionOk] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const g = narrow ? NARROW : WIDE;
  const CX = g.W / 2;
  const CY = g.H / 2;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setMotionOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lit = specialties[active]?.nodes ?? "all";
  const isLit = (id: string) => lit === "all" || lit.includes(id);

  return (
    <div
      ref={wrap}
      className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16"
    >
      <ul className="order-2 grid gap-2 lg:order-1" aria-label="What I do">
        {specialties.map((s, i) => {
          const selected = i === active;
          return (
            <li key={s.title}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`w-full rounded-2xl px-5 py-5 text-left transition-[background-color,color] duration-300 md:px-6 ${
                  selected
                    ? "bg-[color-mix(in_oklab,currentColor_9%,transparent)]"
                    : "hover:bg-[color-mix(in_oklab,currentColor_5%,transparent)]"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 shrink-0 translate-y-[-2px] rounded-full transition-colors duration-300 ${
                      selected ? "bg-[var(--color-coral)]" : "bg-[color-mix(in_oklab,currentColor_25%,transparent)]"
                    }`}
                  />
                  <span className="text-xl font-semibold tracking-tight md:text-2xl">{s.title}</span>
                </span>
                <span className="muted mt-2 block pl-[22px] text-base leading-relaxed">{s.body}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="order-1 lg:order-2">
        <svg
          viewBox={`0 0 ${g.W} ${g.H}`}
          role="img"
          aria-label="Diagram: a product built in React and Java at the center, connected to Salesforce, HubSpot, Quire, Infinite Campus, Regrid, the Claude API, Mailgun, Pendo, NetSuite, SchoolMint, QuickBooks, and USAePay."
          className={`h-auto w-full overflow-visible ${on ? "map-on" : ""}`}
        >
          {NODES.map((n, i) => {
            const p = nodePos(g, n.angle, i);
            const litNow = isLit(n.id);
            return (
              <g key={`l-${n.id}`}>
                <path
                  id={`path-${n.id}`}
                  d={curve(g, p.x, p.y)}
                  pathLength={1}
                  fill="none"
                  className="map-line"
                  style={{ ["--i" as string]: i }}
                  stroke={litNow ? "var(--color-coral)" : "currentColor"}
                  strokeOpacity={litNow ? 0.9 : 0.22}
                  strokeWidth={litNow ? 1.75 : 1.25}
                />
                {on && motionOk && litNow && (
                  <circle r={3.5} fill="var(--color-coral)">
                    <animateMotion
                      dur={`${2.4 + (i % 3) * 0.5}s`}
                      begin={`${1.2 + i * 0.25}s`}
                      repeatCount="indefinite"
                      keyPoints={i % 2 ? "1;0" : "0;1"}
                      keyTimes="0;1"
                      calcMode="linear"
                    >
                      <mpath href={`#path-${n.id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}

          {NODES.map((n, i) => {
            const p = nodePos(g, n.angle, i);
            const w = n.label.length * g.charW + g.padX;
            const litNow = isLit(n.id);
            return (
              <g key={n.id} className="map-node" style={{ ["--i" as string]: i }}>
                <rect
                  x={p.x - w / 2}
                  y={p.y - g.pillH / 2}
                  width={w}
                  height={g.pillH}
                  rx={g.pillH / 2}
                  fill={litNow ? "var(--color-coral)" : "var(--page-bg)"}
                  stroke={litNow ? "var(--color-coral)" : "currentColor"}
                  strokeOpacity={litNow ? 1 : 0.3}
                  style={{ transition: "fill 300ms ease, stroke 300ms ease" }}
                />
                <text
                  x={p.x}
                  y={p.y + g.font * 0.36}
                  textAnchor="middle"
                  fontSize={g.font}
                  fontWeight={600}
                  fill={litNow ? "var(--color-ink)" : "currentColor"}
                  style={{ transition: "fill 300ms ease" }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}

          <g className="map-node" style={{ ["--i" as string]: 0 }}>
            <circle cx={CX} cy={CY} r={g.hub} fill="var(--color-paper)" />
            <text x={CX} y={CY - g.hubFont * 0.35} textAnchor="middle" fontSize={g.hubFont} fontWeight={700} fill="var(--color-ink)">
              Your product
            </text>
            <text x={CX} y={CY + g.hubSub * 1.3} textAnchor="middle" fontSize={g.hubSub} fontWeight={500} fill="var(--color-ink)" fillOpacity={0.7}>
              React + Java
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
