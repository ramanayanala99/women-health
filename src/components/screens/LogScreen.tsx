import StatusBar from "./StatusBar";

const symptoms = ["Cramps", "Headache", "Bloating", "Fatigue", "Acne", "Cravings"];
const moods = ["😔", "😐", "🙂", "😊", "🥰"];

export default function LogScreen() {
  return (
    <div className="h-full w-full bg-[#fffaf8]">
      <StatusBar />
      <div className="px-5 pt-4">
        <p className="text-[11px] font-medium text-plum-faint">Today, Jul 9</p>
        <h1 className="font-display text-[19px] font-semibold text-plum">How are you feeling?</h1>
      </div>

      <div className="mx-4 mt-4 rounded-[22px] bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold text-plum-soft">Mood</p>
        <div className="mt-2.5 flex justify-between">
          {moods.map((m, i) => (
            <span
              key={i}
              className={`grid h-9 w-9 place-items-center rounded-full text-base ${
                i === 3 ? "bg-blush ring-2 ring-rose" : "bg-[#f8f5fb]"
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-[22px] bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold text-plum-soft">Symptoms</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {symptoms.map((s, i) => (
            <span
              key={s}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${
                i === 0 || i === 3
                  ? "text-white"
                  : "bg-[#f8f5fb] text-plum-soft"
              }`}
              style={i === 0 || i === 3 ? { background: "var(--gradient-primary)" } : {}}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-[22px] bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold text-plum-soft">Sleep quality</p>
        <div className="mt-2.5 h-2 w-full rounded-full bg-[#f0eaf8]">
          <div className="h-2 w-[70%] rounded-full" style={{ background: "var(--gradient-primary)" }} />
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-full py-3 text-center text-[13px] font-semibold text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
        Save today&apos;s log
      </div>
    </div>
  );
}
