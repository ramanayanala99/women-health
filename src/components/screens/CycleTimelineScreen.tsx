import StatusBar from "./StatusBar";
import BottomTabBar from "./BottomTabBar";

type Phase = "period" | "follicular" | "fertile" | "ovulation" | "luteal" | "predicted";

const phaseStyle: Record<Phase, string> = {
  period: "bg-rose text-white",
  follicular: "bg-lavender-50 text-plum",
  fertile: "bg-sky-light text-plum",
  ovulation: "bg-peach text-plum",
  luteal: "bg-[#f3eef9] text-plum",
  predicted: "border border-dashed border-rose-light text-plum-soft",
};

function dayPhase(day: number): Phase {
  if (day <= 5) return "period";
  if (day >= 29) return "predicted";
  if (day === 14) return "ovulation";
  if (day >= 11 && day <= 16) return "fertile";
  if (day <= 9) return "follicular";
  return "luteal";
}

const loggedDays = [2, 3, 9, 19, 24];
const today = 18;

const legend: { label: string; swatch: string }[] = [
  { label: "Period", swatch: "bg-rose" },
  { label: "Fertile", swatch: "bg-sky-light" },
  { label: "Ovulation", swatch: "bg-peach" },
  { label: "Luteal", swatch: "bg-[#f3eef9]" },
];

export default function CycleTimelineScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#fffaf8]">
      <StatusBar />
      <div className="px-5 pt-4">
        <p className="text-[11px] font-medium text-plum-faint">July</p>
        <h1 className="font-display text-[19px] font-semibold text-plum">Cycle Timeline</h1>
      </div>

      <div className="mx-4 mt-3 rounded-[22px] bg-white p-3.5 shadow-sm">
        <div className="grid grid-cols-7 gap-y-1.5 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className="text-[8.5px] font-semibold text-plum-faint">{d}</span>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const phase = dayPhase(day);
            const isToday = day === today;
            return (
              <div key={day} className="grid place-items-center py-0.5">
                <div
                  className={`relative grid h-7 w-7 place-items-center rounded-full text-[9.5px] font-semibold ${phaseStyle[phase]} ${
                    isToday ? "ring-2 ring-lavender-600 ring-offset-1" : ""
                  }`}
                >
                  {day}
                  {loggedDays.includes(day) && (
                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-rose-deep" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 border-t border-lavender-50 pt-2.5">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${l.swatch}`} />
              <span className="text-[8.5px] text-plum-faint">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-blush p-3.5">
          <p className="text-[9.5px] font-semibold text-rose-deep">Predicted period</p>
          <p className="mt-1 text-[13px] font-bold text-plum">in 11 days</p>
        </div>
        <div className="rounded-2xl bg-peach-light p-3.5">
          <p className="text-[9.5px] font-semibold text-[#9a5a20]">Ovulation estimate</p>
          <p className="mt-1 text-[13px] font-bold text-plum">Day 14</p>
        </div>
      </div>

      <div className="mx-4 mt-2.5 rounded-2xl bg-sky-light p-3.5">
        <p className="text-[9.5px] font-semibold text-[#256486]">Fertility window</p>
        <p className="mt-1 text-[12px] leading-snug text-plum-soft">
          Day 11 – Day 16 · higher chance of conception
        </p>
      </div>

      <BottomTabBar active="timeline" />
    </div>
  );
}
