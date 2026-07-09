"use client";

import { useState } from "react";

const interests = ["Cycle tracking", "Mood & energy", "AI coach", "Sleep", "Stress & calm", "Privacy controls"];
const platforms = ["iOS", "Android", "Web"];

export default function JoinBetaForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [platform, setPlatform] = useState("iOS");

  function toggleInterest(i: string) {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-[2rem] p-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl" style={{ background: "var(--gradient-primary)" }}>
          ✦
        </span>
        <h3 className="mt-6 font-display text-2xl font-semibold text-plum">You&apos;re on the list 💜</h3>
        <p className="mt-3 text-sm leading-relaxed text-plum-soft">
          Thank you for joining the CycleAI beta. Keep an eye on your inbox —
          we&apos;ll reach out with early access details soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="glass-card space-y-6 rounded-[2rem] p-8 sm:p-10"
    >
      <div>
        <label className="text-sm font-semibold text-plum" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          required
          type="text"
          placeholder="Your name"
          className="mt-2 w-full rounded-xl border border-lavender-100 bg-white/80 px-4 py-3 text-sm text-plum outline-none placeholder:text-plum-faint focus:border-rose-light"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-plum" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          required
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-lavender-100 bg-white/80 px-4 py-3 text-sm text-plum outline-none placeholder:text-plum-faint focus:border-rose-light"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-plum">What matters most to you?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {interests.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => toggleInterest(i)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedInterests.includes(i)
                  ? "border-transparent text-white"
                  : "border-lavender-100 bg-white/70 text-plum-soft hover:border-rose-light"
              }`}
              style={selectedInterests.includes(i) ? { background: "var(--gradient-primary)" } : {}}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-plum">Preferred platform</p>
        <div className="mt-3 flex gap-2">
          {platforms.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                platform === p
                  ? "border-transparent text-white"
                  : "border-lavender-100 bg-white/70 text-plum-soft"
              }`}
              style={platform === p ? { background: "var(--gradient-primary)" } : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-plum-soft">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-lavender-100 accent-[#c48ada]" />
        I understand CycleAI provides educational wellness guidance, not
        medical diagnosis, and I agree to the privacy promise.
      </label>

      <button
        type="submit"
        className="btn-gradient w-full rounded-full py-3.5 text-sm font-semibold text-white"
      >
        Request early access →
      </button>
    </form>
  );
}
