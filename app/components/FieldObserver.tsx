"use client";

import { useEffect } from "react";

// Drives the scroll color story. Whichever section crosses the middle of the
// viewport lends its field colors to <html>, and the body cross-fades.
// Sections paint their own field until this runs, so no-JS still works.
export function FieldObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-field]"),
    );
    if (sections.length === 0) return;

    const apply = (el: HTMLElement) => {
      const s = getComputedStyle(el);
      root.style.setProperty("--active-bg", s.getPropertyValue("--field-bg"));
      root.style.setProperty("--active-fg", s.getPropertyValue("--field-fg"));
      root.style.setProperty("--active-accent", s.getPropertyValue("--field-accent"));
      root.style.setProperty("--active-accent-fg", s.getPropertyValue("--field-accent-fg"));
      root.dataset.activeField = el.dataset.field;
    };

    apply(sections[0]);
    root.classList.add("story");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) apply(entry.target as HTMLElement);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
      root.classList.remove("story");
    };
  }, []);

  return null;
}
