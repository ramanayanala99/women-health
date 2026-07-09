import StatusBar from "./StatusBar";

const fields = [
  { icon: "📅", label: "Last period date", value: "Jun 24, 2026" },
  { icon: "🔁", label: "Average cycle length", value: "28 days" },
  { icon: "🩸", label: "Period length", value: "5 days" },
  { icon: "🎯", label: "Main goal", value: "Understand my patterns" },
  { icon: "🔔", label: "Notifications", value: "On" },
];

export default function OnboardingScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#fffaf8] px-5 pb-5">
      <StatusBar />

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full ${i < 5 ? "w-5" : "w-3"}`}
            style={i < 5 ? { background: "var(--gradient-primary)" } : { background: "#eee5f7" }}
          />
        ))}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-medium text-plum-faint">Step 5 of 6</p>
        <h1 className="mt-1 font-display text-[18px] font-semibold leading-snug text-plum">
          Let&apos;s get to know your cycle
        </h1>
      </div>

      <div className="mt-4 space-y-2">
        {fields.map((f) => (
          <div key={f.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{f.icon}</span>
              <span className="text-[11.5px] font-medium text-plum-soft">{f.label}</span>
            </div>
            <span className="text-[11.5px] font-semibold text-plum">{f.value}</span>
          </div>
        ))}

        <div className="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[5px]" style={{ background: "var(--gradient-primary)" }}>
            <span className="text-[9px] text-white">✓</span>
          </span>
          <span className="text-[11px] leading-snug text-plum-soft">
            I agree to CycleAI&apos;s privacy promise — my data is encrypted
            and never sold.
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="w-full shrink-0 rounded-full py-3.5 text-center text-[13px] font-semibold text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
        Continue
      </div>
    </div>
  );
}
