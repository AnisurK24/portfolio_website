"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#stack", label: "Stack" },
  { href: "#what-i-do", label: "What I do" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Highlight the section in view.
  useEffect(() => {
    const targets = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    const hero = document.querySelector("#top");
    const heroObserver = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(null),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    if (hero) heroObserver.observe(hero);
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--page-bg)_78%,transparent)] backdrop-blur-md transition-colors duration-700" />
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-[72px] md:px-10"
      >
        <a href="#top" className="text-[15px] font-semibold tracking-tight">
          Anisur Khan
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className="rounded-full px-3.5 py-2 text-[15px] font-medium opacity-70 transition-[opacity,background-color] duration-200 hover:opacity-100 aria-[current]:bg-[color-mix(in_oklab,currentColor_12%,transparent)] aria-[current]:opacity-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/Anisur_Khan_Resume.pdf"
            className="hidden h-10 items-center rounded-full border border-[color-mix(in_oklab,currentColor_35%,transparent)] px-4 text-[15px] font-medium transition-colors hover:border-current sm:inline-flex"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <List size={24} weight="regular" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-[var(--color-ink)] text-[var(--color-paper)] transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="text-[15px] font-semibold tracking-tight">Anisur Khan</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="flex flex-1 flex-col justify-center gap-1 px-5">
          {[...LINKS, { href: "/Anisur_Khan_Resume.pdf", label: "Resume" }].map((l, i) => (
            <li
              key={l.href}
              className="transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]"
              style={{
                transitionDelay: open ? `${80 + i * 40}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(16px)",
              }}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="display block py-2 text-[clamp(2.5rem,11vw,4rem)] transition-colors hover:text-[var(--color-coral)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
