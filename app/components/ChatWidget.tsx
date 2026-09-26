"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkle, X } from "@phosphor-icons/react";

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
        aria-label={open ? "Close AI chat" : "Open AI chat about Anisur"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-ink)] pl-4 pr-5 text-[15px] font-semibold text-[var(--color-paper)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)] ring-1 ring-white/10 transition-transform duration-150 ease-out active:scale-[0.97] md:bottom-6 md:right-6"
      >
        {open ? <X size={18} weight="bold" /> : <Sparkle size={18} weight="fill" className="text-[var(--color-coral)]" />}
        {open ? "Close" : "Ask my AI"}
      </button>

      <div
        role="dialog"
        aria-label="Chat about Anisur"
        inert={!open}
        className={`fixed bottom-20 right-4 z-50 flex h-[min(560px,72dvh)] w-[min(400px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-[opacity,transform] duration-200 ease-[var(--ease-out-strong)] md:bottom-[5.5rem] md:right-6 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <header className="border-b border-white/10 px-5 py-4">
          <h2 className="text-[15px] font-semibold">Ask about Anisur</h2>
          <p className="mt-0.5 text-[13px] text-white/60">
            Grounded in his resume. Answers stream from Claude.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 text-[15px] leading-relaxed">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "mb-3 flex justify-end" : "mb-3 flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-coral)] px-3.5 py-2.5 text-[var(--color-ink)]"
                    : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2.5"
                }
              >
                {m.content || (m.role === "assistant" && streaming ? (
                  <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 [animation-delay:300ms]" />
                  </span>
                ) : "")}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {error && (
            <div role="alert" className="mt-2 rounded-xl bg-[#3a1f18] px-3.5 py-2.5 text-sm text-[#ffc2ad]">
              {error}. Try again, or email anisurk24@gmail.com.
            </div>
          )}
          {messages.length <= 1 && (
            <div className="mt-5">
              <p className="mb-2 text-[13px] text-white/60">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={streaming}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-white/85 transition-colors hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] disabled:opacity-50"
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
          className="flex gap-2 border-t border-white/10 p-3"
        >
          <label htmlFor="chat-input" className="sr-only">Your question</label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question"
            disabled={streaming}
            className="min-w-0 flex-1 rounded-full bg-white/[0.07] px-4 py-2.5 text-base text-[var(--color-paper)] placeholder:text-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-coral)] disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={streaming || !input.trim()}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-coral)] text-[var(--color-ink)] transition-[transform,opacity] duration-150 active:scale-[0.95] disabled:opacity-40"
          >
            <ArrowUp size={18} weight="bold" />
          </button>
        </form>
      </div>
    </>
  );
}
