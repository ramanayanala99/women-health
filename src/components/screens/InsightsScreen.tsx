import StatusBar from "./StatusBar";

const bars = [40, 65, 30, 80, 55, 95, 60];

export default function InsightsScreen() {
  return (
    <div className="h-full w-full bg-[#fffaf8]">
      <StatusBar />
      <div className="flex items-center gap-3 px-5 pt-4">
        <span className="text-plum-soft">←</span>
        <h1 className="font-display text-[17px] font-semibold text-plum">Insights</h1>
      </div>

      <div className="mx-4 mt-3 rounded-[24px] bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold text-plum-soft">Energy this week</p>
        <div className="mt-3 flex h-20 items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-full" style={{ height: `${h}%`, background: "var(--gradient-primary)", opacity: 0.35 + (h / 100) * 0.65 }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-plum-faint">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-2.5 rounded-[20px] border border-mint bg-mint-light p-3.5">
        <p className="text-[10.5px] font-semibold text-[#1f6b4a]">Monthly pattern found</p>
        <p className="mt-1 text-[11.5px] leading-snug text-[#2a5b45]">
          On nights with 7+ hours of sleep, your next-day mood score is 34% higher.
        </p>
      </div>

      <div className="mx-4 mt-2.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[9.5px] text-plum-faint">Cycle length avg</p>
          <p className="mt-1 text-[15px] font-bold text-plum">28.4 days</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[9.5px] text-plum-faint">Symptom-free days</p>
          <p className="mt-1 text-[15px] font-bold text-plum">21 / cycle</p>
        </div>
      </div>

      <div className="mx-4 mt-2.5 rounded-[20px] bg-blush p-3.5">
        <p className="text-[10.5px] font-semibold text-rose-deep">Upcoming forecast</p>
        <p className="mt-1 text-[11.5px] leading-snug text-plum-soft">
          Expect a mild energy dip in 3 days — I&apos;ll suggest lighter workouts.
        </p>
      </div>

      <div className="mx-4 mt-2.5 rounded-[20px] bg-sky-light/60 p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-semibold text-[#256486]">Doctor report preview</p>
          <span className="text-[9px] font-semibold text-[#256486]">→</span>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-plum-soft">
          A shareable summary of this month, ready for your next appointment.
        </p>
      </div>
    </div>
  );
}
