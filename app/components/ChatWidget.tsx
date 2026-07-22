"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What does Anisur specialize in?",
  "Tell me about his Salesforce work.",
  "What is transcript-insights?",
  "How long was he at CRETelligent?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi. I'm an AI grounded in Anisur's resume and portfolio. Ask me anything about his experience, projects, or stack.",
    },
  ]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Escape closes the chat.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setError(null);
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    // Optimistic assistant placeholder we will append to.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: "Request failed" }));
        setError(errBody.error || `Error ${res.status}`);
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("No response body");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = {
              role: "assistant",
              content: last.content + chunk,
            };
          }
          return updated;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <button
        aria-label="Open AI chat about Anisur"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-fg)] shadow-lg transition-all hover:scale-105 hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat about Anisur"
          className="fixed bottom-24 right-6 z-50 flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-3rem))] flex-col rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
            <div>
              <h2 className="text-sm font-medium text-[color:var(--color-fg)]">
                Ask my AI
              </h2>
              <p className="text-xs text-[color:var(--color-fg-subtle)]">
                Grounded in Anisur&apos;s resume. Streamed via Claude.
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "mb-3 flex justify-end"
                    : "mb-3 flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-lg bg-[color:var(--color-accent)] px-3 py-2 text-[color:var(--color-bg)]"
                      : "max-w-[85%] rounded-lg border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg)] px-3 py-2 text-[color:var(--color-fg)]"
                  }
                >
                  {m.content || (m.role === "assistant" && streaming ? "…" : "")}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {error && (
              <div className="mt-2 rounded-md border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
                {error}
              </div>
            )}
            {messages.length <= 1 && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-[color:var(--color-fg-subtle)]">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={streaming}
                      className="rounded-full border border-[color:var(--color-border-soft)] px-2.5 py-1 text-xs text-[color:var(--color-fg-muted)] transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-[color:var(--color-border)] p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={streaming}
              className="flex-1 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-fg)] placeholder:text-[color:var(--color-fg-subtle)] focus:border-[color:var(--color-accent)] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="rounded-md bg-[color:var(--color-accent)] px-3 py-2 text-sm font-medium text-[color:var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
