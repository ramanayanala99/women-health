import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, GlowBlob, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing — CycleAI",
  description: "Simple, honest pricing for CycleAI — start free, unlock the AI Coach and deeper body intelligence with Premium.",
};

const plans: {
  name: string;
  tag?: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  comingSoon?: boolean;
}[] = [
  {
    name: "Free",
    price: "$0",
    desc: "Everything you need to start understanding your cycle.",
    features: ["Basic cycle tracking", "Calendar", "Simple symptom logging", "Basic predictions"],
    cta: "Get started free",
    href: "/join-beta",
  },
  {
    name: "Premium",
    tag: "Most popular",
    price: "$9.99",
    period: "/month",
    desc: "Deeper body intelligence, powered by AI.",
    features: [
      "AI Body Forecast",
      "AI Coach",
      "Personalized insights",
      "Monthly reports",
      "Pattern detection",
      "Wellness suggestions",
      "Advanced privacy controls",
    ],
    cta: "Join the Beta",
    href: "/join-beta",
    featured: true,
  },
  {
    name: "Family",
    tag: "Coming soon",
    price: "TBA",
    desc: "Understanding, shared with the people around you.",
    features: ["Partner mode", "Family wellness", "Pregnancy support", "Menopause support", "Wearable integration"],
    cta: "Join the waitlist",
    href: "/join-beta",
    comingSoon: true,
  },
  {
    name: "Corporate / Clinics",
    tag: "Coming soon",
    price: "TBA",
    desc: "Bringing CycleAI to teams and care providers.",
    features: ["Corporate wellness", "Healthcare provider summaries", "Research partnerships with explicit consent"],
    cta: "Get in touch",
    href: "/join-beta",
    comingSoon: true,
  },
];

const faqs = [
  {
    q: "Is this medical advice?",
    a: "No. CycleAI offers educational and wellness guidance based on patterns in your data — it does not diagnose, prescribe, or replace professional medical care.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your health data is encrypted, never sold, and always under your control.",
  },
  {
    q: "Can I delete my data?",
    a: "Anytime, with a single request — deletion is permanent, not just hidden.",
  },
  {
    q: "Does it work for irregular cycles?",
    a: "Yes — CycleAI is built to learn your personal patterns, including cycles that don't follow a textbook 28-day rhythm.",
  },
  {
    q: "Is there a free version?",
    a: "Yes. The Free plan includes core cycle tracking, calendar, symptom logging, and basic predictions — no credit card required.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="peach" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="lavender" />
        <Container className="relative text-center">
          <Pill tone="peach">Pricing</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Start free. Unlock deeper body intelligence when you&apos;re ready.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            No dark patterns, no data-selling business model — just a plan
            that grows with how much of CycleAI you want.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-4 lg:items-start">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`relative flex h-full flex-col rounded-[2rem] p-7 ${
                  p.featured
                    ? "border-2 border-lavender-300 bg-lavender-50/50 shadow-xl"
                    : "glass-card"
                }`}
              >
                {p.tag && (
                  <span className="absolute -top-3 right-7">
                    <Pill tone={p.featured ? "lavender" : "peach"}>
                      {p.featured ? "✦ " : ""}
                      {p.tag}
                    </Pill>
                  </span>
                )}

                <p className="text-sm font-semibold text-plum-faint">{p.desc}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-plum">{p.name}</h3>

                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-3xl font-semibold text-plum">{p.price}</span>
                  {p.period && <span className="pb-1 text-sm text-plum-faint">{p.period}</span>}
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-plum-soft">
                      <span className={p.comingSoon ? "text-plum-faint" : "text-rose-deep"}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={p.href}
                  variant={p.featured ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {p.cta}
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-2xl font-semibold text-plum">
            Pricing questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group glass-card rounded-2xl p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-plum">
                  {f.q}
                  <span className="ml-4 text-lavender-600 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-plum-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <DisclaimerBanner className="mt-10" />
        </Container>
      </section>
    </>
  );
}
