"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "ai"; text: string };

const context = [
  { icon: "🌙", label: "Cycle Day", value: "18" },
  { icon: "🌿", label: "Phase", value: "Follicular" },
  { icon: "⚡", label: "Energy", value: "High" },
  { icon: "😴", label: "Sleep", value: "7h 45m" },
];

const initialMessages: Message[] = [
  { role: "user", text: "Why am I feeling emotional today?" },
  {
    role: "ai",
    text: "Based on your current cycle phase and recent logs, your mood may be influenced by changing hormone patterns, sleep quality, and stress levels. Today's data suggests your energy is stable, but your sensitivity may be slightly elevated. A short walk, hydration, and a calmer evening routine may help. If emotional changes feel intense or unusual for you, consider speaking with a healthcare professional.",
  },
];

const responses: Record<string, string> = {
  "Why am I tired?":
    "Your logs show shorter sleep the past two nights alongside your current cycle phase, which can add up to lower energy. Gentle movement, an earlier wind-down, and staying hydrated often help. If tiredness feels extreme or doesn't improve with rest, it's worth mentioning to your doctor.",
  "How can I reduce cramps?":
    "Cramps often ease with warmth (like a heating pad), light stretching, and staying hydrated — your logs show they tend to peak on day 1–2 and settle after. Over-the-counter options can help many people, but if cramps are severe or unusual for you, please check in with a healthcare professional.",
  "Why do I have cravings?":
    "Cravings, especially for carbs or sweets, are commonly linked to hormonal shifts and can be intensified by sleep changes. Balanced meals with protein and fiber often help steady things out. If cravings feel disruptive or hard to manage, a conversation with a doctor or dietitian can help too.",
};

const chips = Object.keys(responses);

const fallback =
  "That's a great question for your logs over time. I'm designed for educational, pattern-based guidance — not a diagnosis. Try one of the prompt chips to see a full example, or join the beta to ask this on your real data.";

export default function AICoachDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: responses[text] ?? fallback }]);
      setTyping(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }, 900);
  }

  return (
    <div className="glass-card overflow-hidden rounded-[2.25rem]">
      {/* header */}
      <div className="flex items-center justify-between gap-4 border-b border-lavender-100/60 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3.5">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            ✦
          </span>
          <div>
            <p className="font-display text-base font-semibold text-plum sm:text-lg">CycleAI Coach</p>
            <p className="text-xs text-plum-faint">Personalized explanation preview</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mint-light px-3 py-1.5 text-xs font-semibold text-[#1f6b4a]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2fae74]" />
          AI Ready
        </span>
      </div>

      {/* context row */}
      <div className="grid grid-cols-2 gap-2.5 px-6 pt-5 sm:grid-cols-4 sm:px-8">
        {context.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white/70 px-3.5 py-3 text-center shadow-sm">
            <p className="text-base">{c.icon}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-plum-faint">{c.label}</p>
            <p className="text-sm font-semibold text-plum">{c.value}</p>
          </div>
        ))}
      </div>

      {/* chat */}
      <div ref={scrollRef} className="max-h-[420px] space-y-3 overflow-y-auto px-6 py-6 sm:px-8">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user" ? "ml-auto rounded-tr-sm text-white" : "rounded-tl-sm bg-white text-plum shadow-sm"
            }`}
            style={m.role === "user" ? { background: "var(--gradient-primary)" } : {}}
          >
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="w-fit rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lavender-300 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lavender-300 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lavender-300" />
            </div>
          </div>
        )}
      </div>

      {/* prompt chips + input */}
      <div className="border-t border-lavender-100/60 px-6 py-4 sm:px-8">
        <div className="flex flex-wrap gap-2 pb-3">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              className="rounded-full border border-lavender-100 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-plum-soft transition-colors hover:border-rose-light hover:text-rose-deep"
            >
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-full border border-lavender-100 bg-white px-4 py-2.5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CycleAI anything…"
            className="flex-1 bg-transparent text-sm text-plum outline-none placeholder:text-plum-faint"
          />
          <button
            type="submit"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm text-white"
            style={{ background: "var(--gradient-primary)" }}
            aria-label="Send"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
