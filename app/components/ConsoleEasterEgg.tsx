"use client";

import { useEffect } from "react";

const ART = `
    _    _  __
   / \\  | |/ /
  / _ \\ | ' /
 / ___ \\| . \\
/_/   \\_\\_|\\_\\
`;

export function ConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("easter_egg_shown") === "1") return;

    const big = "font-size: 14px; font-family: ui-monospace, Menlo, monospace; color: #7dd3fc;";
    const muted = "color: #9b9ba0; font-family: ui-sans-serif, system-ui;";
    const accent = "color: #7dd3fc; font-family: ui-sans-serif, system-ui;";
    const heavy = "color: #e9e9ea; font-weight: 600; font-family: ui-sans-serif, system-ui;";

    console.log(`%c${ART}`, big);
    console.log("%cHey. You opened the dev tools.", heavy);
    console.log(
      "%cIf you're here because you're curious about how the site works,",
      muted,
    );
    console.log("%cthe whole thing is open source:", muted);
    console.log("%c  https://github.com/AnisurK24/portfolio_website", accent);
    console.log("");
    console.log("%cIf you're here because you're hiring, even better.", heavy);
    console.log("%c  anisurk24@gmail.com", accent);
    console.log("");
    console.log(
      "%cThe chat widget bottom-right is grounded Claude. Ask it anything.",
      muted,
    );

    try {
      sessionStorage.setItem("easter_egg_shown", "1");
    } catch {}
  }, []);

  return null;
}
