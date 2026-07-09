import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, SectionHeading, GlowBlob, Card, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "AI Science — CycleAI",
  description: "CycleAI is evidence-informed, privacy-first, and safety-aware — see what it analyzes, how the AI helps, what it deliberately does not do, and the safety framework behind it.",
};

const analyzes = [
  { icon: "🌙", label: "Cycle phase" },
  { icon: "📏", label: "Cycle length" },
  { icon: "🗓️", label: "Period timing" },
  { icon: "🌸", label: "Symptom logs" },
  { icon: "💗", label: "Mood" },
  { icon: "⚡", label: "Energy" },
  { icon: "😴", label: "Sleep" },
  { icon: "🧘", label: "Stress" },
  { icon: "🌿", label: "Lifestyle patterns" },
];

const howAiHelps = [
  { icon: "🔍", title: "Detects repeated patterns", desc: "Notices what reliably shows up together in your own logs, cycle after cycle." },
  { icon: "💡", title: "Explains daily changes", desc: "Turns today's data into a clear, calm explanation of what may be happening." },
  { icon: "🔮", title: "Predicts likely symptoms", desc: "Forecasts what tends to follow, based on your history, so less catches you off guard." },
  { icon: "🌱", title: "Creates helpful wellness suggestions", desc: "Offers gentle, personalized next steps you can actually act on." },
];

const doesNotDo = [
  "Does not diagnose",
  "Does not prescribe medication",
  "Does not replace medical care",
  "Does not create fear-based alerts",
];

const safetyFramework = [
  { icon: "🗣️", title: "Clear language", desc: "Plain, human explanations — never clinical jargon or vague hedging." },
  { icon: "📊", title: "Confidence-aware answers", desc: "CycleAI is upfront about how certain a pattern is, instead of overstating it." },
  { icon: "🩺", title: "Medical escalation guidance", desc: "Recognizes when something is beyond its lane and points you to a professional." },
  { icon: "🔑", title: "User-controlled data", desc: "You decide what's logged, what's kept, and what's deleted — always." },
  { icon: "🔒", title: "Privacy-first design", desc: "Encrypted, never sold, built around your consent from the first screen." },
];

export default function AISciencePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="sky" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="mint" />
        <Container className="relative text-center">
          <Pill tone="sky">Science</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Built on body patterns, not guesswork.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            CycleAI combines cycle science, personal trends, and explainable
            AI to help users understand what may be happening in their body.
          </p>
        </Container>
      </section>

      {/* WHAT CYCLEAI ANALYZES */}
      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="Signals"
            title="What CycleAI analyzes"
            description="Every insight is built from signals you choose to share — nothing more, nothing hidden."
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-9">
            {analyzes.map((a) => (
              <div
                key={a.label}
                className="glass-card flex flex-col items-center gap-2 rounded-2xl px-3 py-6 text-center lg:px-2"
              >
                <span className="text-xl">{a.icon}</span>
                <p className="text-xs font-semibold leading-snug text-plum">{a.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW AI HELPS */}
      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="Explainable AI"
            title="How AI helps"
            description="CycleAI turns raw signals into something you can actually understand and use."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howAiHelps.map((h) => (
              <Card key={h.title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-light text-xl">
                  {h.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-plum">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{h.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* WHAT CYCLEAI DOES NOT DO */}
      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-lavender-100 bg-lavender-50/60 p-10 sm:p-14">
            <Pill tone="lavender">Boundaries, by design</Pill>
            <h2 className="mt-5 font-display text-2xl font-semibold text-plum sm:text-3xl">
              What CycleAI does not do
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-plum-soft">
              Just as important as what CycleAI can explain is what it
              deliberately stays away from.
            </p>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {doesNotDo.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 px-5 py-4 text-sm font-medium text-plum"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lavender-100 text-xs text-lavender-600">
                    ✕
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* SAFETY FRAMEWORK */}
      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="Safety framework"
            title="Built to be trustworthy, not just clever"
            description="Five commitments that shape every response CycleAI gives."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {safetyFramework.map((s) => (
              <Card key={s.title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-light text-xl">
                  {s.icon}
                </span>
                <h3 className="mt-5 font-display text-base font-semibold text-plum">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{s.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* DOCTOR-FRIENDLY REPORTS */}
      <section className="pb-24">
        <Container>
          <div className="glass-card grid gap-10 rounded-[2.5rem] p-10 sm:p-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <Pill tone="sky">📄 Coming to a future version</Pill>
              <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-plum sm:text-3xl">
                Doctor-friendly reports
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-plum-soft sm:text-base">
                CycleAI is designed so your patterns don&apos;t stay locked in an
                app. In future versions, you&apos;ll be able to generate a clear,
                shareable summary of your cycle, symptoms, sleep, and stress
                trends — built to make your next appointment easier, not to
                replace it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-plum-soft">
                You&apos;ll always choose what&apos;s included before anything is
                shared, and a report is a conversation starter for your
                healthcare provider — never a diagnosis on its own.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-sky-light/60 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#256486]">
                Sample summary preview
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Average cycle length", value: "28.4 days" },
                  { label: "Symptom-free days", value: "21 / cycle" },
                  { label: "Sleep average", value: "7.1 hrs / night" },
                  { label: "Notable pattern", value: "Lower pain after 7+ hrs sleep" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3">
                    <span className="text-xs text-plum-faint">{row.label}</span>
                    <span className="text-sm font-semibold text-plum">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-sky-light via-lavender-50 to-mint-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              Curious how this feels day to day?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/ai-demo" size="lg">Try the AI Demo →</Button>
              <Button href="/how-it-works" variant="secondary" size="lg">See how it works</Button>
            </div>
          </div>
          <DisclaimerBanner className="mt-10 text-left" />
        </Container>
      </section>
    </>
  );
}
