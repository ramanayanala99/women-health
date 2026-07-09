import StatusBar from "./StatusBar";

const stats = [
  { icon: "⚡", label: "Energy", value: "High" },
  { icon: "💗", label: "Mood", value: "Positive" },
  { icon: "😴", label: "Sleep", value: "7h 45m" },
  { icon: "🧘", label: "Stress", value: "Low" },
];

const tabs = [
  { label: "Today", icon: TodayIcon, active: true },
  { label: "Timeline", icon: TimelineIcon, active: false },
  { label: "Coach", icon: CoachIcon, active: false },
  { label: "Insights", icon: InsightsIcon, active: false },
  { label: "You", icon: YouIcon, active: false },
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

      <div className="flex-1" />

      {/* bottom tab bar */}
      <div className="mx-3 mb-3 flex items-center justify-between rounded-[22px] bg-white/90 px-3 py-2.5 shadow-[0_8px_24px_-10px_rgba(169,136,221,0.4)] backdrop-blur">
        {tabs.map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-1 px-1">
            <t.icon active={t.active} />
            <span className={`text-[8.5px] font-medium ${t.active ? "text-rose-deep" : "text-plum-faint"}`}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function iconColor(active: boolean) {
  return active ? "#e2607e" : "#8a7c9e";
}

function TodayIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="4.5" stroke={iconColor(active)} strokeWidth="1.4" />
      <path d="M9 1.5V3M9 15v1.5M16.5 9H15M3 9H1.5M14.2 3.8l-1 1M4.8 13.2l-1 1M14.2 14.2l-1-1M4.8 4.8l-1-1" stroke={iconColor(active)} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="13" rx="2.5" stroke={iconColor(active)} strokeWidth="1.4" />
      <path d="M2 7H16" stroke={iconColor(active)} strokeWidth="1.4" />
      <path d="M6 1.5V4M12 1.5V4" stroke={iconColor(active)} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function CoachIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 8.4C2 5 4.8 2.5 8.5 2.5S15 5 15 8.4c0 3.4-2.8 5.9-6.5 5.9-.7 0-1.4-.1-2-.3L3 15.5l1-3.1C2.6 11.2 2 9.9 2 8.4Z"
        stroke={iconColor(active)}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 15V9M9 15V3M15 15v-6" stroke={iconColor(active)} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function YouIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="5.8" r="3" stroke={iconColor(active)} strokeWidth="1.4" />
      <path d="M2.8 15.5c.9-3 3.2-4.6 6.2-4.6s5.3 1.6 6.2 4.6" stroke={iconColor(active)} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
