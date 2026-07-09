import StatusBar from "./StatusBar";

export default function WelcomeScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#f4effc] via-[#fdeff2] to-[#ffe4cb] px-7 pb-7 text-center">
      <StatusBar />

      <div className="mt-10 flex flex-1 flex-col items-center justify-center">
        <div className="grid h-16 w-16 place-items-center rounded-[1.5rem] text-2xl text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
          ✦
        </div>
        <h1 className="mt-6 font-display text-[21px] font-semibold leading-snug text-plum">
          Your body has a pattern.
          <br /> CycleAI helps you understand it.
        </h1>
        <p className="mt-3 text-[12px] leading-relaxed text-plum-soft">
          Cycle, mood, energy, sleep, and stress — brought together, calmly.
        </p>
      </div>

      <div className="shrink-0 space-y-3">
        <div className="w-full rounded-full py-3.5 text-[13px] font-semibold text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
          Get Started
        </div>
        <div className="w-full rounded-full border border-lavender-100 bg-white/70 py-3.5 text-[13px] font-semibold text-plum">
          Log In
        </div>
        <p className="pt-1 text-[9.5px] text-plum-faint">
          Educational guidance only — not a medical diagnosis
        </p>
      </div>
    </div>
  );
}
