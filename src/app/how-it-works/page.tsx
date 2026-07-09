import type { Metadata } from "next";
import Button from "@/components/Button";
import PhoneMockup from "@/components/PhoneMockup";
import LogScreen from "@/components/screens/LogScreen";
import InsightsScreen from "@/components/screens/InsightsScreen";
import AIChatScreen from "@/components/screens/AIChatScreen";
import TodayScreen from "@/components/screens/TodayScreen";
import { Container, Pill, SectionHeading, GlowBlob, Card, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "How It Works — CycleAI",
  description: "See how CycleAI turns a few daily taps into a personal understanding of your cycle, mood, energy, symptoms, sleep, and stress.",
};

const journey = [
  {
    step: "01",
    title: "Log your day in seconds",
    desc: "A few gentle taps for mood, energy, sleep, and symptoms. No long forms, no clinical checklists — just quick, honest check-ins that fit into real life.",
    screen: <LogScreen />,
  },
  {
    step: "02",
    title: "CycleAI learns your rhythm",
    desc: "Behind the scenes, CycleAI builds a private model of your unique patterns — cycle phase, sleep trends, mood swings, and stress signals — instead of relying on generic averages.",
    screen: <TodayScreen />,
  },
  {
    step: "03",
    title: "See patterns you'd otherwise miss",
    desc: "Correlations between sleep and mood, stress and cycle length, or energy and symptoms are surfaced clearly — so you understand the 'why', not just the 'what'.",
    screen: <InsightsScreen />,
  },
  {
    step: "04",
    title: "Ask anything, anytime",
    desc: "Chat naturally with your AI coach about how you're feeling. It responds with context from your own history — calmly, kindly, and grounded in women's health science.",
    screen: <AIChatScreen />,
  },
];

const principles = [
  {
    icon: "🧠",
    title: "Personal, not generic",
    desc: "Insights are built from your data over time — your body isn't compared to a stranger's average cycle.",
  },
  {
    icon: "🌿",
    title: "Calm by design",
    desc: "No alarming red flags or clinical jargon. Just clear, gentle language you can actually act on.",
  },
  {
    icon: "🩺",
    title: "Knows its limits",
    desc: "CycleAI never diagnoses. When something looks severe or unusual, it tells you to speak with a doctor.",
  },
  {
    icon: "🔒",
    title: "Private, always",
    desc: "Everything you log stays encrypted and under your control — never sold, never shared without consent.",
  },
];

const faqs = [
  {
    q: "Does CycleAI replace my doctor?",
    a: "No. CycleAI offers educational, wellness-focused guidance based on patterns in your own data. It is not a substitute for professional medical advice, diagnosis, or treatment.",
  },
  {
    q: "How long until insights feel personal?",
    a: "Many patterns emerge within your first 1–2 cycles of logging, and they keep refining the more consistently you check in.",
  },
  {
    q: "What if my symptoms feel serious?",
    a: "CycleAI will always recommend speaking with a healthcare professional when symptoms are severe, persistent, or unusual — your safety comes first.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="sky" />
        <GlowBlob className="-right-20 top-24 h-72 w-72" color="peach" />
        <Container className="relative text-center">
          <Pill tone="lavender">How it works</Pill>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            A gentle daily habit that turns into
            <span className="gradient-text"> lifelong understanding</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            No spreadsheets. No clinical forms. Just a calm rhythm of logging,
            learning, and understanding — built around how women actually live.
          </p>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="space-y-28">
          {journey.map((j, i) => (
            <div
              key={j.step}
              className={`grid items-center gap-14 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="flex justify-center">
                <PhoneMockup size="small">{j.screen}</PhoneMockup>
              </div>
              <div>
                <span className="font-display text-6xl font-semibold text-lavender-100">
                  {j.step}
                </span>
                <h2 className="mt-2 font-display text-3xl font-semibold text-plum">
                  {j.title}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-plum-soft">
                  {j.desc}
                </p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Our principles"
            title="How CycleAI thinks about your body"
            description="Every design decision follows the same values — personal, calm, honest about its limits, and private."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <Card key={p.title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blush text-xl">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-plum">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{p.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="Questions" title="Good to know" />
          <div className="mx-auto mt-12 max-w-2xl space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group glass-card rounded-2xl p-5 open:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-plum">
                  {f.q}
                  <span className="ml-4 text-lavender-600 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-plum-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              Ready to start understanding your body?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/join-beta" size="lg">Join the Beta →</Button>
              <Button href="/ai-demo" variant="secondary" size="lg">Try the AI Demo</Button>
            </div>
          </div>
          <DisclaimerBanner className="mt-10 text-left" />
        </Container>
      </section>
    </>
  );
}
