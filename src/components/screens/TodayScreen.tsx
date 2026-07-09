import StatusBar from "./StatusBar";

export default function TodayScreen() {
  return (
    <div className="h-full w-full bg-gradient-to-b from-[#f4effc] via-[#fdeff2] to-[#ffe4cb]">
      <StatusBar />
      <div className="px-5 pt-4">
        <p className="text-[11px] font-medium text-plum-faint">Good morning</p>
        <h1 className="font-display text-[19px] font-semibold text-plum">Hi, Maya ✦</h1>
      </div>

      {/* cycle ring card */}
      <div className="mx-4 mt-4 rounded-[26px] bg-white/80 p-4 shadow-[0_10px_30px_-12px_rgba(169,136,221,0.35)] backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="relative h-[84px] w-[84px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f4effc" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#ring)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - 0.52)}
              />
              <defs>
                <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a988dd" />
                  <stop offset="60%" stopColor="#c48ada" />
                  <stop offset="100%" stopColor="#f2879f" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-[17px] font-bold leading-none text-plum">14</p>
                <p className="text-[9px] text-plum-faint">day</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-deep">
              Ovulation window
            </p>
            <p className="mt-1 text-[13px] leading-snug text-plum-soft">
              Energy tends to peak today. A great window for strength training.
            </p>
          </div>
        </div>
      </div>

      {/* quick log */}
      <div className="mx-4 mt-3 grid grid-cols-4 gap-2">
        {[
          { label: "Mood", emoji: "😊" },
          { label: "Energy", emoji: "⚡" },
          { label: "Sleep", emoji: "🌙" },
          { label: "Symptom", emoji: "🌸" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 py-2.5 shadow-sm"
          >
            <span className="text-base">{item.emoji}</span>
            <span className="text-[9px] font-medium text-plum-soft">{item.label}</span>
          </div>
        ))}
      </div>

      {/* AI insight teaser */}
      <div className="mx-4 mt-3 rounded-[22px] p-4" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
          CycleAI Insight
        </p>
        <p className="mt-1.5 text-[12.5px] leading-snug text-white">
          Your sleep has been 40 min shorter for 3 nights — this often nudges next week&apos;s
          energy dip earlier. Want a wind-down plan?
        </p>
      </div>

      <div className="mx-4 mt-3 flex gap-2">
        <div className="flex-1 rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <p className="text-[15px] font-bold text-plum">7.2h</p>
          <p className="text-[9px] text-plum-faint">Sleep</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <p className="text-[15px] font-bold text-plum">Calm</p>
          <p className="text-[9px] text-plum-faint">Stress</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <p className="text-[15px] font-bold text-plum">High</p>
          <p className="text-[9px] text-plum-faint">Energy</p>
        </div>
      </div>
    </div>
  );
}
