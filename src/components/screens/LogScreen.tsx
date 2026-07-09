import StatusBar from "./StatusBar";
import BottomTabBar from "./BottomTabBar";

const moods = ["😔", "😐", "🙂", "😊", "🥰"];
const symptoms = ["Cramps", "Headache", "Bloating", "Cravings", "Fatigue", "Acne"];

function LevelRow({ label, level, tone = "var(--gradient-primary)" }: { label: string; level: number; tone?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[10.5px] font-medium text-plum-soft">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="h-1.5 w-3.5 rounded-full"
            style={i <= level ? { background: tone } : { background: "#f0eaf8" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LogScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#fffaf8]">
      <StatusBar />
      <div className="px-5 pt-3">
        <p className="text-[10px] font-medium text-plum-faint">Today, Jul 9</p>
        <h1 className="font-display text-[17px] font-semibold text-plum">How are you feeling?</h1>
      </div>

      <div className="mx-4 mt-2.5 rounded-[18px] bg-white p-3 shadow-sm">
        <p className="text-[10.5px] font-semibold text-plum-soft">Mood</p>
        <div className="mt-1.5 flex justify-between">
          {moods.map((m, i) => (
            <span
              key={i}
              className={`grid h-7 w-7 place-items-center rounded-full text-[13px] ${
                i === 3 ? "bg-blush ring-2 ring-rose" : "bg-[#f8f5fb]"
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-2 divide-y divide-lavender-50 rounded-[18px] bg-white px-3 py-1 shadow-sm">
        <LevelRow label="Pain level" level={2} tone="#e2607e" />
        <LevelRow label="Energy" level={4} />
        <LevelRow label="Stress" level={2} tone="#2fae74" />
        <div className="flex items-center justify-between py-1.5">
          <span className="text-[10.5px] font-medium text-plum-soft">Sleep</span>
          <span className="text-[10px] font-semibold text-plum">7h 45m</span>
        </div>
      </div>

      <div className="mx-4 mt-2 rounded-[18px] bg-white p-3 shadow-sm">
        <p className="text-[10.5px] font-semibold text-plum-soft">Symptoms &amp; cravings</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {symptoms.map((s, i) => (
            <span
              key={s}
              className={`rounded-full px-2.5 py-1 text-[9.5px] font-medium ${
                i === 0 || i === 3 ? "text-white" : "bg-[#f8f5fb] text-plum-soft"
              }`}
              style={i === 0 || i === 3 ? { background: "var(--gradient-primary)" } : {}}
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-2 border-t border-lavender-50 pt-2 text-[10px] leading-snug text-plum-faint">
          Notes: add anything else you noticed today…
        </p>
      </div>

      <div className="flex-1" />

      <div className="mx-4 mb-2 shrink-0 rounded-full py-2.5 text-center text-[12.5px] font-semibold text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
        Save today&apos;s log
      </div>

      <BottomTabBar active="log" />
    </div>
  );
}
