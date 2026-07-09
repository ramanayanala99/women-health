const cards = [
  {
    icon: "🧬",
    title: "Body Intelligence",
    desc: "Everything about you, connected.",
    tone: "lavender" as const,
  },
  {
    icon: "🗓️",
    title: "Cycle Timeline",
    desc: "See your whole month at a glance.",
    tone: "rose" as const,
  },
  {
    icon: "🔮",
    title: "AI Forecast",
    desc: "Know what's coming, before it comes.",
    tone: "peach" as const,
  },
  {
    icon: "💬",
    title: "Ask CycleAI",
    desc: "Talk to your coach, anytime.",
    tone: "sky" as const,
  },
  {
    icon: "🌸",
    title: "Symptom Tracker",
    desc: "Log how you feel in seconds.",
    tone: "mint" as const,
  },
];

const tones: Record<string, string> = {
  lavender: "bg-lavender-50",
  rose: "bg-blush",
  peach: "bg-peach-light",
  sky: "bg-sky-light",
  mint: "bg-mint-light",
};

const rotations = ["lg:-rotate-2", "lg:rotate-1", "lg:-rotate-1", "lg:rotate-2", "lg:-rotate-1"];

export default function StackedDemoCards() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col lg:max-w-[17rem]">
      {cards.map((c, i) => (
        <div
          key={c.title}
          className={`glass-card group relative flex items-center gap-3.5 rounded-2xl p-4 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-xl ${
            i === 0 ? "" : "mt-3 lg:-mt-2"
          } ${rotations[i]}`}
          style={{ zIndex: i + 1 }}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${tones[c.tone]}`}>
            {c.icon}
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-plum">{c.title}</p>
            <p className="mt-0.5 text-xs leading-snug text-plum-soft">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
