import StatusBar from "./StatusBar";

export default function OnboardingScreen() {
  return (
    <div className="flex h-full w-full flex-col items-center bg-gradient-to-b from-[#f4effc] via-[#fdeff2] to-[#ffe4cb] px-6 pb-6 text-center">
      <StatusBar />
      <div className="mt-6 grid h-14 w-14 shrink-0 place-items-center rounded-[1.4rem] text-2xl text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
        ✦
      </div>
      <h1 className="mt-4 font-display text-[18px] font-semibold leading-snug text-plum">
        Understand your body
        <br /> before it changes
      </h1>
      <p className="mt-2 text-[11.5px] leading-relaxed text-plum-soft">
        CycleAI learns your cycle, mood, energy, symptoms, sleep, and stress —
        gently, privately, and just for you.
      </p>

      <div className="mt-4 w-full flex-1 space-y-2 overflow-hidden">
        <div className="rounded-2xl bg-white/80 px-3.5 py-2.5 text-left text-[11px] font-medium text-plum shadow-sm">
          🌙 Track your cycle
        </div>
        <div className="rounded-2xl bg-white/80 px-3.5 py-2.5 text-left text-[11px] font-medium text-plum shadow-sm">
          ✦ Chat with your AI coach
        </div>
        <div className="rounded-2xl bg-white/80 px-3.5 py-2.5 text-left text-[11px] font-medium text-plum shadow-sm">
          🔒 Your data stays yours
        </div>
      </div>

      <div className="w-full shrink-0 rounded-full py-3 text-[12.5px] font-semibold text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
        Get started
      </div>
      <p className="mt-3 shrink-0 text-[9.5px] text-plum-faint">Educational guidance only — not a medical diagnosis</p>
    </div>
  );
}
