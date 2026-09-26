"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn border border-current"
      aria-live="polite"
    >
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <Copy
          size={20}
          className={`absolute transition-[opacity,transform,filter] duration-200 ${
            copied ? "scale-75 opacity-0 blur-[2px]" : "opacity-100"
          }`}
        />
        <Check
          size={20}
          weight="bold"
          className={`absolute transition-[opacity,transform,filter] duration-200 ${
            copied ? "opacity-100" : "scale-75 opacity-0 blur-[2px]"
          }`}
        />
      </span>
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
