"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Command = {
  id: string;
  label: string;
  hint?: string;
  shortcut?: string;
  group: string;
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      close();
    },
    [close],
  );

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("anisurk24@gmail.com").catch(() => {});
    close();
  }, [close]);

  const openLink = useCallback(
    (url: string) => {
      window.open(url, "_blank", "noopener,noreferrer");
      close();
    },
    [close],
  );

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute("data-theme") ?? "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    close();
  }, [close]);

  const openChat = useCallback(() => {
    // Find and click the chat widget toggle button via aria-label.
    const btn = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Open AI chat about Anisur"]',
    );
    btn?.click();
    close();
  }, [close]);

  const commands: Command[] = useMemo(
    () => [
      { id: "nav-top", label: "Go to top", group: "Navigation", action: () => scrollTo("__top__") },
      { id: "nav-work", label: "Go to work", group: "Navigation", action: () => scrollTo("work") },
      { id: "nav-stack", label: "Go to stack", group: "Navigation", action: () => scrollTo("stack") },
      { id: "nav-contact", label: "Go to contact", group: "Navigation", action: () => scrollTo("contact") },
      { id: "chat-open", label: "Open AI chat", hint: "Ask my AI about Anisur", shortcut: "C", group: "Actions", action: openChat },
      { id: "copy-email", label: "Copy email", hint: "anisurk24@gmail.com", shortcut: "E", group: "Actions", action: copyEmail },
      { id: "resume", label: "Download resume", group: "Actions", action: () => openLink("/Anisur_Khan_Resume.pdf") },
      { id: "theme", label: "Toggle theme", shortcut: "T", group: "Actions", action: toggleTheme },
      { id: "github", label: "Open GitHub", hint: "github.com/AnisurK24", group: "Links", action: () => openLink("https://github.com/AnisurK24") },
      { id: "linkedin", label: "Open LinkedIn", group: "Links", action: () => openLink("https://www.linkedin.com/in/anisur-khan-88a00182/") },
      { id: "transcript-insights", label: "Open transcript-insights", hint: "Multi-agent Claude project", group: "Links", action: () => openLink("https://github.com/AnisurK24/transcript-insights") },
    ],
    [scrollTo, copyEmail, openLink, toggleTheme, openChat],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      [c.label, c.hint ?? "", c.group].join(" ").toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Group filtered for display.
  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of filtered) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Open with Cmd+K / Ctrl+K. Close with Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Reset active index when filter changes.
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Arrow keys + Enter for navigation inside the palette.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIdx];
      if (cmd) cmd.action();
    }
  };

  // Focus input when opened.
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Scroll active item into view.
  useEffect(() => {
    const li = listRef.current?.querySelector<HTMLLIElement>(
      `li[data-index="${activeIdx}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  let runningIdx = -1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      role="dialog"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] px-4">
          <span className="text-[color:var(--color-fg-subtle)]">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search commands..."
            className="flex-1 bg-transparent py-3 text-sm text-[color:var(--color-fg)] placeholder:text-[color:var(--color-fg-subtle)] focus:outline-none"
          />
          <kbd className="rounded border border-[color:var(--color-border-soft)] px-1.5 py-0.5 text-xs text-[color:var(--color-fg-subtle)]">
            esc
          </kbd>
        </div>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {grouped.length === 0 && (
            <li className="px-4 py-3 text-sm text-[color:var(--color-fg-subtle)]">
              No matches.
            </li>
          )}
          {grouped.map(([group, items]) => (
            <li key={group}>
              <div className="px-4 pb-1 pt-3 text-xs uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
                {group}
              </div>
              <ul>
                {items.map((cmd) => {
                  runningIdx += 1;
                  const active = runningIdx === activeIdx;
                  const myIdx = runningIdx;
                  return (
                    <li
                      key={cmd.id}
                      data-index={myIdx}
                      onMouseEnter={() => setActiveIdx(myIdx)}
                      onClick={cmd.action}
                      className={
                        "flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm " +
                        (active
                          ? "bg-[color:var(--color-accent)]/15 text-[color:var(--color-fg)]"
                          : "text-[color:var(--color-fg-muted)] hover:bg-white/5")
                      }
                    >
                      <div className="flex flex-col">
                        <span>{cmd.label}</span>
                        {cmd.hint && (
                          <span className="text-xs text-[color:var(--color-fg-subtle)]">
                            {cmd.hint}
                          </span>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className="rounded border border-[color:var(--color-border-soft)] px-1.5 py-0.5 text-xs text-[color:var(--color-fg-subtle)]">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-4 py-2 text-xs text-[color:var(--color-fg-subtle)]">
          <span>
            <kbd className="rounded border border-[color:var(--color-border-soft)] px-1.5 py-0.5">↑↓</kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="rounded border border-[color:var(--color-border-soft)] px-1.5 py-0.5">↵</kbd>{" "}
            run
          </span>
          <span>
            <kbd className="rounded border border-[color:var(--color-border-soft)] px-1.5 py-0.5">⌘K</kbd>{" "}
            toggle
          </span>
        </div>
      </div>
    </div>
  );
}
