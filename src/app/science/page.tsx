import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, SectionHeading, GlowBlob, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Science — CycleAI",
  description: "The physiology and methodology behind CycleAI — how cycle science and personalized pattern recognition come together, and where the limits of AI guidance are.",
};

const phases = [
  {
    name: "Menstrual",
    days: "Days 1–5",
    color: "rose" as const,
    desc: "Estrogen and progesterone are at their lowest. Energy often dips; rest and gentle movement tend to feel best.",
  },
  {
    name: "Follicular",
    days: "Days 1–13",
    color: "sky" as const,
    desc: "Estrogen begins rising as follicles mature. Many notice steadily improving energy and mood.",
  },
  {
    name: "Ovulation",
    days: "~Day 14",
    color: "peach" as const,
    desc: "A surge in luteinizing hormone triggers ovulation. Energy and confidence often peak around this window.",
  },
  {
    name: "Luteal",
    days: "Days 15–28",
    color: "lavender" as const,
    desc: "Progesterone rises then falls. Mood, sleep, and appetite shifts are common in the days before your period.",
  },
];

const methodology = [
  {
    icon: "📊",
    title: "Personal baselines, not population averages",
    desc: "CycleAI builds a model of what's normal specifically for you, refining with every log instead of comparing you to a generic 28-day cycle.",
  },
  {
    icon: "🔗",
    title: "Correlation, clearly labeled",
    desc: "When CycleAI surfaces a link — like sleep and mood — it's described as an observed pattern in your data, not a proven cause.",
  },
  {
    icon: "🧭",
    title: "Guidance with guardrails",
    desc: "The AI is designed to stay in the lane of education and wellness, and to explicitly step back when something looks clinical.",
  },
  {
    icon: "🔁",
    title: "Continuously reviewed",
    desc: "Our approach is developed in consultation with OB-GYNs, reproductive health researchers, and behavioral scientists, and evolves as understanding grows.",
  },
];

export default function SciencePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="lavender" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="mint" />
        <Container className="relative text-center">
          <Pill tone="mint">📚 Grounded, not gimmicky</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            The science behind CycleAI
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            CycleAI is built on well-established reproductive physiology and a
            methodology that respects the difference between a pattern and a
            diagnosis.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="The cycle, understood"
            title="Four phases, one continuous story"
            description="Your cycle isn't just about your period — hormonal shifts across all four phases quietly influence mood, energy, sleep, and more."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((p) => (
              <Card key={p.name}>
                <Pill tone={p.color}>{p.days}</Pill>
                <h3 className="mt-4 font-display text-xl font-semibold text-plum">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{p.desc}</p>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-plum-faint">
            Phase lengths vary by person and cycle — these ranges are general
            reference points, not predictions for any individual.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="Methodology"
            title="How CycleAI actually reasons about your body"
            description="Every insight follows the same careful process — from raw logs to language you can trust."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {methodology.map((m) => (
              <Card key={m.title} className="flex gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lavender-50 text-xl">
                  {m.icon}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-plum">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-plum-soft">{m.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="rounded-[2.5rem] border border-rose-light bg-blush p-10 sm:p-14">
            <Pill tone="rose">🩺 Medical disclaimer</Pill>
            <h2 className="mt-5 font-display text-2xl font-semibold text-plum sm:text-3xl">
              CycleAI is educational — not a medical device
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-plum-soft">
              <p>
                CycleAI does not diagnose, treat, cure, or prevent any disease
                or medical condition, and it is not a substitute for
                professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                Insights are generated from patterns in your self-reported
                data and general reproductive health education. They are
                intended to support your own understanding and conversations
                with your healthcare provider — not to replace them.
              </p>
              <p className="font-semibold text-plum">
                If you experience symptoms that are severe, persistent, or
                unusual — including significant pain, irregular bleeding, or
                any symptom that concerns you — please contact a licensed
                healthcare professional promptly.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              Curious how this feels day to day?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/ai-demo" size="lg">Try the AI Demo →</Button>
              <Button href="/how-it-works" variant="secondary" size="lg">See how it works</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
