import type { Metadata } from "next";
import PricingToggle from "@/components/PricingToggle";
import { Container, Pill, GlowBlob, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing — CycleAI",
  description: "Simple, honest pricing for CycleAI — free to start, with a Premium AI coach and family sharing available.",
};

const faqs = [
  {
    q: "Is CycleAI really free to start?",
    a: "Yes — Essential is free forever, covering core cycle, mood, energy, and symptom tracking.",
  },
  {
    q: "What do beta members get?",
    a: "Everyone who joins the beta gets extended free access to Premium features while we refine CycleAI together.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Always. There's no lock-in — cancel in a couple of taps and keep your exported data.",
  },
  {
    q: "Is my payment and health data linked or sold?",
    a: "Never. Billing information is handled separately from your health data, which is never sold to anyone.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="peach" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="lavender" />
        <Container className="relative text-center">
          <Pill tone="peach">✦ Free during beta</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Simple pricing, always honest
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            Start free. Upgrade only if CycleAI earns it. No dark patterns, no
            data-selling business model — ever.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <PricingToggle />
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
