import StatusBar from "./StatusBar";
import BottomTabBar from "./BottomTabBar";

const stats = [
  { icon: "⚡", label: "Energy", value: "High" },
  { icon: "💗", label: "Mood", value: "Positive" },
  { icon: "😴", label: "Sleep", value: "7h 45m" },
  { icon: "🧘", label: "Stress", value: "Low" },
];

const recommendations = [
  { icon: "💧", label: "Hydrate" },
  { icon: "🚶", label: "Gentle walk" },
  { icon: "😴", label: "Wind down early" },
];

export default function BodyScoreScreen() {
  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-b from-[#f4effc] via-[#fdeff2] to-[#ffe4cb]">
      <StatusBar />
      <div className="px-5 pt-4">
        <p className="text-[11px] font-medium text-plum-faint">Good morning</p>
        <h1 className="font-display text-[19px] font-semibold text-plum">Ava ✦</h1>
      </div>

      <div className="mx-4 mt-4 rounded-[26px] bg-white/80 p-4 shadow-[0_10px_30px_-12px_rgba(169,136,221,0.35)] backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="relative h-[88px] w-[88px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f4effc" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#bodyRing)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - 0.87)}
              />
              <defs>
                <linearGradient id="bodyRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a988dd" />
                  <stop offset="60%" stopColor="#c48ada" />
                  <stop offset="100%" stopColor="#f2879f" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-[20px] font-bold leading-none text-plum">87</p>
                <p className="mt-1 text-[8px] uppercase tracking-wide text-plum-faint">Body Score</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-deep">
              Ovulation in 3 days
            </p>
            <p className="mt-1 text-[13px] leading-snug text-plum-soft">
              Today: <span className="font-semibold text-plum">Follicular Phase</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5 rounded-2xl bg-white/75 px-3.5 py-3 shadow-sm">
            <span className="text-base">{s.icon}</span>
            <div>
              <p className="text-[9px] text-plum-faint">{s.label}</p>
              <p className="text-[12px] font-semibold text-plum">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 rounded-[22px] p-4" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
          CycleAI Insight
        </p>
        <p className="mt-1.5 text-[12px] leading-snug text-white">
          Your sleep has been shorter this week — expect a small energy dip.
          Tonight&apos;s a good night for an earlier bedtime.
        </p>
      </div>

      <div className="mx-4 mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-plum-faint">
          Today&apos;s recommendations
        </p>
        <div className="mt-2 flex gap-2">
          {recommendations.map((r) => (
            <div key={r.label} className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white/75 py-2.5 shadow-sm">
              <span className="text-sm">{r.icon}</span>
              <span className="text-center text-[8.5px] font-medium leading-tight text-plum-soft">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomTabBar active="today" />
    </div>
  );
}
