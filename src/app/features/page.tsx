import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, SectionHeading, GlowBlob, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Features — CycleAI",
  description: "Explore every part of the CycleAI Women's Health Operating System — cycle intelligence, mood, energy, symptoms, sleep, stress, AI coaching, and privacy controls.",
};

const groups: {
  eyebrow: string;
  title: string;
  tone: "lavender" | "rose" | "peach" | "sky" | "mint";
  icon: string;
  features: { title: string; desc: string; soon?: boolean }[];
}[] = [
  {
    eyebrow: "Cycle",
    title: "Cycle intelligence",
    tone: "lavender",
    icon: "🌙",
    features: [
      { title: "Adaptive predictions", desc: "Cycle and ovulation windows that recalibrate as your own data grows." },
      { title: "Phase-aware view", desc: "See menstrual, follicular, ovulation, and luteal phases mapped to how you actually feel." },
      { title: "Irregular cycle flags", desc: "Gentle, clear flags when timing shifts outside your usual range." },
      { title: "Multi-year history", desc: "Zoom out across months and years to see the bigger picture of your body." },
    ],
  },
  {
    eyebrow: "Mood & Energy",
    title: "Mood & energy patterns",
    tone: "rose",
    icon: "💗",
    features: [
      { title: "Daily check-ins", desc: "A ten-second tap to log how you feel emotionally and physically." },
      { title: "Mood-cycle correlation", desc: "Visualize how mood shifts alongside your cycle phase over time." },
      { title: "Energy curve", desc: "Understand your natural highs and lows across each month." },
      { title: "Gentle pattern alerts", desc: "Notice recurring emotional patterns without judgment or alarm." },
    ],
  },
  {
    eyebrow: "Symptoms",
    title: "Symptom tracking",
    tone: "rose",
    icon: "🌸",
    features: [
      { title: "One-tap logging", desc: "Cramps, headaches, bloating, acne, cravings, and more — logged in seconds." },
      { title: "Custom symptoms", desc: "Add your own symptoms and track what matters specifically to you." },
      { title: "Severity over time", desc: "See whether a symptom is easing, holding steady, or intensifying." },
      { title: "Recurring pattern detection", desc: "Spot symptoms that reliably show up at the same point each cycle." },
    ],
  },
  {
    eyebrow: "Sleep",
    title: "Sleep awareness",
    tone: "sky",
    icon: "😴",
    features: [
      { title: "Sleep duration & quality", desc: "Track how much and how well you're sleeping, night by night." },
      { title: "Sleep-mood-energy links", desc: "See how sleep quietly shapes your next day's mood and energy." },
      { title: "Wind-down guidance", desc: "Gentle, personalized suggestions for better rest before bed." },
      { title: "Wearable sync", desc: "Bring in sleep data automatically from your favorite wearable.", soon: true },
    ],
  },
  {
    eyebrow: "Stress",
    title: "Stress & calm",
    tone: "mint",
    icon: "🧘",
    features: [
      { title: "Stress check-ins", desc: "A quick daily pulse on how stressed or at ease you're feeling." },
      { title: "Calm exercises", desc: "Short breathing and grounding exercises timed to your needs." },
      { title: "Stress-cycle insights", desc: "Understand how stress and your cycle influence each other." },
      { title: "Recovery nudges", desc: "Gentle reminders to rest when your patterns suggest you need it." },
    ],
  },
  {
    eyebrow: "AI Coach",
    title: "Your personal AI coach",
    tone: "lavender",
    icon: "✦",
    features: [
      { title: "Natural conversation", desc: "Ask questions in plain language and get context-aware answers." },
      { title: "Personalized insights", desc: "Guidance shaped by your own history — not generic population averages." },
      { title: "Weekly digest", desc: "A calm summary of the patterns CycleAI noticed this week." },
      { title: "Knows its limits", desc: "Always recommends professional care for anything severe or unusual." },
    ],
  },
  {
    eyebrow: "Privacy",
    title: "Privacy & control",
    tone: "peach",
    icon: "🔒",
    features: [
      { title: "End-to-end encryption", desc: "Your data is encrypted in transit and at rest, always." },
      { title: "Export anytime", desc: "Download your full history whenever you want it, in your format." },
      { title: "Delete anytime", desc: "Permanently remove your data with a single, honest request." },
      { title: "Never sold", desc: "Identifiable health data is never sold — a permanent product promise." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="mint" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="rose" />
        <Container className="relative text-center">
          <Pill tone="lavender">Everything inside CycleAI</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            One calm home for every signal your body sends
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            Cycle, mood, energy, symptoms, sleep, stress, and an AI coach that
            ties it all together — with privacy built in from the start.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="space-y-20">
          {groups.map((g) => (
            <div key={g.title}>
              <SectionHeading align="left" eyebrow={g.eyebrow} title={g.title} />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {g.features.map((f) => (
                  <div key={f.title} className="glass-card relative rounded-2xl p-6">
                    {f.soon && (
                      <span className="absolute right-4 top-4">
                        <Pill tone={g.tone}>Coming soon</Pill>
                      </span>
                    )}
                    <h3 className="pr-16 font-display text-base font-semibold text-plum">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-plum-soft">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              See it all working together
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/ai-demo" size="lg">Try the AI Demo →</Button>
              <Button href="/pricing" variant="secondary" size="lg">View pricing</Button>
            </div>
          </div>
          <DisclaimerBanner className="mt-10 text-left" />
        </Container>
      </section>
    </>
  );
}
