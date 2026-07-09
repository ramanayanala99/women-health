import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-7xl px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Pill({
  children,
  tone = "lavender",
}: {
  children: ReactNode;
  tone?: "lavender" | "rose" | "mint" | "peach" | "sky";
}) {
  const tones: Record<string, string> = {
    lavender: "bg-lavender-50 text-lavender-600 border-lavender-100",
    rose: "bg-blush text-rose-deep border-blush-deep",
    mint: "bg-mint-light text-[#1f6b4a] border-mint",
    peach: "bg-peach-light text-[#9a5a20] border-peach",
    sky: "bg-sky-light text-[#256486] border-sky",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={`mx-auto max-w-2xl ${align === "center" ? "text-center" : "text-left mx-0"}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-plum sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-plum-soft">{description}</p>
      )}
    </div>
  );
}

export function GlowBlob({ className = "", color = "lavender" }: { className?: string; color?: string }) {
  const colors: Record<string, string> = {
    lavender: "#c4a9ec",
    rose: "#fbc9d4",
    peach: "#ffe4cb",
    mint: "#dbf6e9",
    sky: "#ddf1fa",
  };
  return (
    <div
      className={`blob ${className}`}
      style={{ background: colors[color] ?? colors.lavender }}
      aria-hidden
    />
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass-card rounded-3xl p-7 ${className}`}>{children}</div>;
}

export function DisclaimerBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`glass-card flex items-start gap-4 rounded-2xl border-lavender-100 p-5 ${className}`}
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender-50 text-base">
        🩺
      </span>
      <p className="text-sm leading-relaxed text-plum-soft">
        <span className="font-semibold text-plum">CycleAI is educational, not medical.</span>{" "}
        It offers wellness guidance and pattern insights — it does not diagnose conditions or
        replace your healthcare provider. If something feels severe, persistent, or unusual,
        please talk to a doctor.
      </p>
    </div>
  );
}
