import type { ReactElement } from "react";

export type TabKey = "today" | "timeline" | "log" | "coach" | "you";

const tabs: { key: TabKey; label: string; icon: (p: { active: boolean }) => ReactElement }[] = [
  { key: "today", label: "Today", icon: TodayIcon },
  { key: "timeline", label: "Timeline", icon: TimelineIcon },
  { key: "log", label: "Log", icon: LogIcon },
  { key: "coach", label: "Coach", icon: CoachIcon },
  { key: "you", label: "You", icon: YouIcon },
];

export default function BottomTabBar({ active }: { active: TabKey }) {
  return (
    <div className="mx-3 mb-3 mt-auto flex shrink-0 items-center justify-between rounded-[22px] bg-white/90 px-3 py-2.5 shadow-[0_8px_24px_-10px_rgba(169,136,221,0.4)] backdrop-blur">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <div key={t.key} className="flex flex-col items-center gap-1 px-1">
            <t.icon active={isActive} />
            <span className={`text-[8.5px] font-medium ${isActive ? "text-rose-deep" : "text-plum-faint"}`}>
              {t.label}
            </span>
          </div>
        );
      })}
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
function LogIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.3" stroke={iconColor(active)} strokeWidth="1.4" />
      <path d="M9 5.8V12.2M5.8 9H12.2" stroke={iconColor(active)} strokeWidth="1.5" strokeLinecap="round" />
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
function YouIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="5.8" r="3" stroke={iconColor(active)} strokeWidth="1.4" />
      <path d="M2.8 15.5c.9-3 3.2-4.6 6.2-4.6s5.3 1.6 6.2 4.6" stroke={iconColor(active)} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
