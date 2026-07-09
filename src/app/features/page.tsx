import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, GlowBlob, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Features — CycleAI",
  description: "AI Body Forecast, Cycle Timeline, AI Coach, Symptom Tracker, Insights & Trends, Privacy First, Monthly Reports, and Wellness Guidance — everything inside CycleAI.",
};

type Tone = "lavender" | "rose" | "peach" | "sky" | "mint";

const iconBg: Record<Tone, string> = {
  lavender: "bg-lavender-50",
  rose: "bg-blush",
  peach: "bg-peach-light",
  sky: "bg-sky-light",
  mint: "bg-mint-light",
};

const features: {
  icon: string;
  title: string;
  tone: Tone;
  desc: string;
  items?: string[];
  highlight?: string;
}[] = [
  {
    icon: "🔮",
    title: "AI Body Forecast",
    tone: "lavender",
    desc: "CycleAI looks ahead — not just at where you are today, but at what tomorrow may bring.",
    items: ["Energy", "Mood", "Pain", "Cravings", "Stress sensitivity", "Sleep readiness", "Workout readiness"],
  },
  {
    icon: "🗓️",
    title: "Cycle Timeline",
    tone: "rose",
    desc: "Your whole month, laid out clearly — phases, predictions, and history in one continuous view.",
    items: ["Cycle phase", "Period prediction", "Ovulation window", "Fertility awareness", "Symptom history", "Mood & energy patterns"],
  },
  {
    icon: "💬",
    title: "AI Coach",
    tone: "sky",
    desc: "Ask questions in plain language and get calm, personalized explanations grounded in your own data.",
    items: ["Natural conversation", "Context-aware answers", "Available anytime", "Always knows its limits"],
  },
  {
    icon: "🌸",
    title: "Symptom Tracker",
    tone: "rose",
    desc: "Log how you feel in seconds — everything in one place, nothing forgotten.",
    items: ["Pain", "Mood", "Energy", "Sleep", "Stress", "Headaches", "Bloating", "Cravings", "Acne", "Exercise", "Hydration", "Notes"],
  },
  {
    icon: "📈",
    title: "Insights & Trends",
    tone: "mint",
    desc: "CycleAI surfaces the patterns hiding in your logs — clearly, without the guesswork.",
    highlight: "“Your pain score tends to be lower after nights with more than 7 hours of sleep.”",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    tone: "peach",
    desc: "Your health data is some of the most sensitive information you own — treated that way from day one.",
    items: ["Export your data", "Delete your account", "Granular privacy controls", "Protected, encrypted storage"],
  },
  {
    icon: "📄",
    title: "Monthly Reports",
    tone: "lavender",
    desc: "A clear, doctor-friendly summary of your month — ready whenever you need it for an appointment.",
    items: ["Cycle summary", "Symptom overview", "Sleep & stress trends", "Shareable PDF export"],
  },
  {
    icon: "🌿",
    title: "Wellness Guidance",
    tone: "mint",
    desc: "Gentle, personalized suggestions for the things that actually move the needle.",
    items: ["Hydration", "Nutrition", "Movement", "Rest", "Stress management"],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="mint" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="rose" />
        <Container className="relative text-center">
          <Pill tone="lavender">Features</Pill>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Everything your body wants to tell you — in one intelligent app.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            CycleAI brings cycle tracking, AI forecasting, symptom logging,
            insights, and wellness guidance into one beautiful daily
            companion.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="glass-card rounded-[2rem] p-8 sm:p-10">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${iconBg[f.tone]}`}>
                  {f.icon}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-plum sm:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-plum-soft sm:text-base">{f.desc}</p>

                {f.items && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {f.items.map((item) => (
                      <Pill key={item} tone={f.tone}>
                        {item}
                      </Pill>
                    ))}
                  </div>
                )}

                {f.highlight && (
                  <div className="mt-6 rounded-2xl border border-mint bg-mint-light p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#1f6b4a]">
                      Sample insight
                    </p>
                    <p className="mt-1.5 text-sm italic leading-relaxed text-[#2a5b45]">
                      {f.highlight}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
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
