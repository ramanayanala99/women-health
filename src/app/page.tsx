import Button from "@/components/Button";
import PhoneMockup from "@/components/PhoneMockup";
import BodyScoreScreen from "@/components/screens/BodyScoreScreen";
import AIChatScreen from "@/components/screens/AIChatScreen";
import StackedDemoCards from "@/components/StackedDemoCards";
import WatchDemoButton from "@/components/WatchDemoButton";
import { Container, Pill, SectionHeading, GlowBlob, Card, DisclaimerBanner } from "@/components/ui";

const benefits = [
  {
    icon: "🧠",
    title: "Real AI. Real results.",
    desc: "Evidence-informed AI that helps explain why you may feel different.",
  },
  {
    icon: "🔒",
    title: "Privacy by design.",
    desc: "Your data is private, secure, and always in your control.",
  },
  {
    icon: "🌱",
    title: "Learns and improves with you.",
    desc: "The more you use CycleAI, the more personalized it becomes.",
  },
];

const trustStrip = [
  { icon: "🔬", label: "Evidence-informed" },
  { icon: "🎯", label: "Personalized for you" },
  { icon: "🤝", label: "AI you can trust" },
  { icon: "🌿", label: "Designed for real life" },
  { icon: "🔒", label: "Privacy first" },
];

const steps = [
  {
    title: "Log in seconds",
    desc: "Track your cycle, mood, energy, symptoms, sleep, and stress with a few gentle taps.",
  },
  {
    title: "AI learns your patterns",
    desc: "CycleAI quietly studies what's unique to your body over time — not generic averages.",
  },
  {
    title: "Get guidance that fits you",
    desc: "Receive calm, personalized insights and wellness suggestions before things change.",
  },
];

const testimonials = [
  {
    quote:
      "It finally feels like an app that understands my whole cycle, not just a calendar with dots.",
    name: "Priya",
    tag: "Early access member",
  },
  {
    quote:
      "The AI insights caught a sleep-energy pattern I never noticed myself. Genuinely useful.",
    name: "Sofia",
    tag: "Early access member",
  },
  {
    quote:
      "Soft, calm, and private. It doesn't feel clinical — it feels like it's actually mine.",
    name: "Amara",
    tag: "Early access member",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
        <GlowBlob className="-left-32 -top-20 h-96 w-96" color="lavender" />
        <GlowBlob className="-right-24 top-40 h-80 w-80" color="rose" />
        <GlowBlob className="left-1/3 bottom-0 h-72 w-72" color="peach" />

        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1fr_0.95fr_0.85fr]">
          <div>
            <Pill tone="lavender">✦ AI Health</Pill>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-plum sm:text-5xl">
              Experience CycleAI in{" "}
              <span className="gradient-text">action.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-plum-soft">
              See how our AI understands your body, learns your patterns, and
              gives you personal insights that actually help.
            </p>

            <div className="mt-9 space-y-5">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blush text-base">
                    {b.icon}
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-plum">{b.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-plum-soft">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/ai-demo" size="lg">
                Try CycleAI Demo →
              </Button>
              <WatchDemoButton />
            </div>
          </div>

          <div className="relative mx-auto flex justify-center">
            <PhoneMockup size="large" className="rotate-3">
              <BodyScoreScreen />
            </PhoneMockup>
          </div>

          <div className="sm:col-span-2 xl:col-span-1">
            <StackedDemoCards />
          </div>
        </Container>
      </section>

      {/* TRUST STRIP */}
      <section className="pb-20">
        <Container>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-plum-faint">
            Built with privacy-first, evidence-informed wellness principles
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {trustStrip.map((t) => (
              <div
                key={t.label}
                className="glass-card flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center"
              >
                <span className="text-xl">{t.icon}</span>
                <p className="text-xs font-semibold text-plum">{t.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* NOT JUST A TRACKER */}
      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="More than a period tracker"
            title="A whole-body operating system for women's health"
            description="CycleAI connects the dots between your cycle, emotions, energy, sleep, and stress — the way Apple Health tracks fitness and Oura tracks recovery, but built entirely around you."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🌙",
                title: "Cycle intelligence",
                desc: "Adaptive predictions that improve the more your body shares with it.",
              },
              {
                icon: "💗",
                title: "Mood & energy patterns",
                desc: "See how your emotional and physical energy shift across your cycle.",
              },
              {
                icon: "🌸",
                title: "Symptom tracking",
                desc: "Log symptoms in seconds and spot recurring patterns over months.",
              },
              {
                icon: "😴",
                title: "Sleep awareness",
                desc: "Understand how sleep quality connects to mood, energy, and cycle phase.",
              },
              {
                icon: "🧘",
                title: "Stress & calm",
                desc: "Gentle nudges to regulate stress before it affects your body.",
              },
              {
                icon: "✦",
                title: "AI-guided insights",
                desc: "Clear, kind explanations — never overwhelming, always personal.",
              },
            ].map((f) => (
              <Card key={f.title} className="transition-transform hover:-translate-y-1">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lavender-50 text-xl">
                  {f.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-plum">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{f.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blush/60 via-transparent to-transparent" />
        <Container className="relative">
          <SectionHeading
            eyebrow="How it works"
            title="From daily logs to lifelong understanding"
            description="Three gentle steps stand between you and a clearer picture of your body."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <span className="font-display text-5xl font-semibold text-lavender-100">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-plum">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/how-it-works" variant="secondary">
              Explore the full journey
            </Button>
          </div>
        </Container>
      </section>

      {/* AI DEMO PREVIEW */}
      <section className="py-24">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2 flex justify-center lg:order-1">
            <PhoneMockup size="small">
              <AIChatScreen />
            </PhoneMockup>
          </div>
          <div className="order-1 lg:order-2">
            <Pill tone="rose">✦ Meet your AI coach</Pill>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-plum sm:text-4xl">
              Talk to CycleAI like a
              <br /> knowledgeable friend
            </h2>
            <p className="mt-5 text-base leading-relaxed text-plum-soft">
              Ask questions about your symptoms, energy, or mood — and get calm,
              pattern-based answers rooted in your own data and women&apos;s health
              science. Always educational. Never diagnostic.
            </p>
            <div className="mt-8">
              <Button href="/ai-demo" size="lg">
                Try the AI Demo →
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* PRIVACY PROMISE */}
      <section className="py-24">
        <Container>
          <div className="glass-card rounded-[2.5rem] p-10 sm:p-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <Pill tone="mint">🔒 Privacy, as a promise</Pill>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-plum">
                  Your body. Your data.
                  <br /> Always yours.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-plum-soft">
                  Health data is some of the most sensitive information you own.
                  CycleAI is built privacy-first from day one — encrypted, never
                  sold, and always under your control.
                </p>
                <Button href="/join-beta" variant="secondary" className="mt-8">
                  Read our privacy promise
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: "🔐", title: "Encrypted end-to-end", desc: "Your logs are encrypted in transit and at rest." },
                  { icon: "🚫", title: "Never sold", desc: "We never sell identifiable health data. Ever." },
                  { icon: "🧭", title: "You're in control", desc: "Export or delete your data anytime, no questions." },
                  { icon: "🩺", title: "Not a diagnosis", desc: "Educational guidance — always paired with real care." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/70 p-5">
                    <span className="text-xl">{item.icon}</span>
                    <p className="mt-3 text-sm font-semibold text-plum">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-plum-soft">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <Container>
          <SectionHeading eyebrow="Early access voices" title="What our beta community is feeling" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <p className="text-sm leading-relaxed text-plum-soft">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-plum">{t.name}</p>
                    <p className="text-xs text-plum-faint">{t.tag}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SCIENCE STRIP */}
      <section className="pb-24">
        <Container>
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 text-center sm:p-14">
            <Pill tone="lavender">📚 Grounded in women&apos;s health science</Pill>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              Every insight is designed with clinicians, researchers, and real
              cycle science in mind.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/science" size="lg">
                Explore the science
              </Button>
              <Button href="/join-beta" variant="secondary" size="lg">
                Join the beta
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <DisclaimerBanner />
        </Container>
      </section>
    </>
  );
}
