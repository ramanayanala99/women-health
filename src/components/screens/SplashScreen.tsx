export default function SplashScreen() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-5 px-10 text-center"
      style={{ background: "var(--gradient-soft)" }}
    >
      <div
        className="grid h-20 w-20 place-items-center rounded-[1.75rem] text-3xl text-white shadow-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        ✦
      </div>
      <h1 className="font-display text-[26px] font-semibold text-plum">
        Cycle<span className="gradient-text">AI</span>
      </h1>
      <p className="text-[12.5px] leading-snug text-plum-soft">
        Understand your body before it changes.
      </p>
    </div>
  );
}
