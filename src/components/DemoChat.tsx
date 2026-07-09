"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "ai"; text: string };

const presets: { q: string; a: string }[] = [
  {
    q: "Why am I so tired this week?",
    a: "Your logs show 3 nights of shorter sleep right as you moved into your luteal phase — energy dips here are common as progesterone rises. Try shifting your workout to mornings and easing caffeine after 2pm. If fatigue feels extreme or doesn't lift, it's worth mentioning to your doctor.",
  },
  {
    q: "Is it normal to feel anxious before my period?",
    a: "Many people notice more anxiety in the days before their period due to hormonal shifts — often called PMS-related mood changes. Your own logs show a similar dip in calm around day 24–26 each cycle. Gentle movement, sleep consistency, and journaling can help. If anxiety feels overwhelming or persistent, please talk to a healthcare professional.",
  },
  {
    q: "What does my cycle length trend tell me?",
    a: "Over your last 4 cycles, your average length is 28.4 days with low variability — a sign of a fairly regular cycle. Occasional shifts of 2–3 days are normal and can relate to stress or sleep. I'll flag it clearly if a bigger shift appears.",
  },
  {
    q: "Best time for a workout this week?",
    a: "You're entering your ovulation window, where energy and strength often peak. This is typically a great window for higher-intensity training, based on the pattern in your own logs.",
  },
];

const disclaimerReply =
  "That's a great question for your logs over time. I'm designed for educational, pattern-based guidance — not a diagnosis. Try one of the sample questions to see a full example, or join the beta to ask this on your real data. If anything feels severe or unusual, please check with a healthcare professional.";

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi, I'm CycleAI. Ask me about your mood, energy, symptoms, or cycle patterns — I'll answer using the kind of context I'd learn from your own logs.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim() || typing) return;
    const preset = presets.find((p) => p.q === text);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: preset ? preset.a : disclaimerReply }]);
      setTyping(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }, 900);
  }

  return (
    <div className="glass-card flex h-[560px] flex-col overflow-hidden rounded-[2rem] sm:h-[600px]">
      <div className="flex items-center gap-3 border-b border-lavender-100/60 px-6 py-4">
        <span
          className="grid h-9 w-9 place-items-center rounded-full text-sm text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          ✦
        </span>
        <div>
          <p className="text-sm font-semibold text-plum">CycleAI Coach — Live Demo</p>
          <p className="text-xs text-plum-faint">Illustrative responses · not connected to real health data</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto rounded-tr-sm text-white"
                : "rounded-tl-sm bg-white text-plum shadow-sm"
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

      <div className="border-t border-lavender-100/60 px-4 py-3">
        <div className="flex flex-wrap gap-2 pb-3">
          {presets.map((p) => (
            <button
              key={p.q}
              onClick={() => send(p.q)}
              className="rounded-full border border-lavender-100 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-plum-soft transition-colors hover:border-rose-light hover:text-rose-deep"
            >
              {p.q}
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
