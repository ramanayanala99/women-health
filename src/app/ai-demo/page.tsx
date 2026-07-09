import type { Metadata } from "next";
import AICoachDemo from "@/components/AICoachDemo";
import { Container, Pill, SectionHeading, GlowBlob } from "@/components/ui";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "AI Demo — CycleAI",
  description: "Ask CycleAI why you feel different — a live preview of cycle-aware, pattern-aware, safe and supportive AI explanations.",
};

const intelligence = [
  {
    icon: "🌙",
    title: "Cycle-aware",
    desc: "Responses shift with where you are in your cycle — never generic, one-size-fits-all advice.",
  },
  {
    icon: "📊",
    title: "Pattern-aware",
    desc: "Looks at your own logs over time to spot what's really going on for you.",
  },
  {
    icon: "💬",
    title: "Human language",
    desc: "Explains things like a knowledgeable friend, not a clinical lab report.",
  },
  {
    icon: "🩺",
    title: "Guardrails",
    desc: "Always knows when to step back and point you toward a healthcare professional.",
  },
];

const explainers = [
  {
    q: "Why am I so tired today?",
    a: "Explores sleep debt, cycle phase, and recent activity together.",
  },
  {
    q: "Why are my cramps worse?",
    a: "Looks at intensity trends, stress, and hydration patterns over time.",
  },
  {
    q: "What should I do tomorrow?",
    a: "Suggests gentle, personalized next-day guidance based on your data.",
  },
];

export default function AIDemoPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="rose" />
        <GlowBlob className="-right-24 top-32 h-72 w-72" color="lavender" />
        <Container className="relative text-center">
          <Pill tone="lavender">✦ AI Science</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Ask CycleAI why you feel different.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            CycleAI combines your cycle phase, recent logs, sleep, energy,
            mood, and symptom patterns to explain what may be happening in
            clear, supportive language.
          </p>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="mx-auto max-w-2xl">
          <AICoachDemo />
        </Container>
      </section>

      <section className="pb-20">
        <Container className="mx-auto max-w-2xl">
          <div className="glass-card flex items-center gap-4 rounded-2xl px-6 py-5 text-center sm:text-left">
            <span className="hidden shrink-0 text-xl sm:block">🩺</span>
            <p className="mx-auto text-sm leading-relaxed text-plum-soft sm:mx-0">
              <span className="font-semibold text-plum">
                CycleAI gives education and wellness support only.
              </span>{" "}
              It does not diagnose, prescribe, or replace medical care.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="Under the hood" title="What makes it intelligent" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {intelligence.map((c) => (
              <div key={c.title} className="glass-card rounded-2xl p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lavender-50 text-xl">
                  {c.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-plum">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{c.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="Ask anything" title="Questions CycleAI can help explain" />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {explainers.map((e) => (
              <div key={e.q} className="glass-card rounded-2xl p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blush text-xl">
                  💭
                </span>
                <h3 className="mt-5 font-display text-base font-semibold leading-snug text-plum">
                  {e.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{e.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              Want this running on your own patterns?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/join-beta" size="lg">Join the Beta →</Button>
              <Button href="/features" variant="secondary" size="lg">See all features</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
