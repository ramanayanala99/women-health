import type { Metadata } from "next";
import DemoChat from "@/components/DemoChat";
import { Container, Pill, SectionHeading, GlowBlob, Card, DisclaimerBanner } from "@/components/ui";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "AI Demo — CycleAI",
  description: "Try a live illustrative demo of the CycleAI coach — calm, personalized, pattern-based guidance about your cycle, mood, energy, and symptoms.",
};

const capabilities = [
  { icon: "🌙", title: "Cycle-aware answers", desc: "Responses reference where you likely are in your cycle and what that phase tends to mean." },
  { icon: "📈", title: "Pattern recognition", desc: "Surfaces correlations across sleep, mood, energy, and symptoms instead of generic tips." },
  { icon: "🗣️", title: "Natural conversation", desc: "Ask follow-up questions freely — CycleAI keeps context like a knowledgeable friend." },
  { icon: "🩺", title: "Knows when to step back", desc: "Always defers to a healthcare professional for anything serious, persistent, or unusual." },
];

export default function AIDemoPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="rose" />
        <GlowBlob className="-right-24 top-32 h-72 w-72" color="lavender" />
        <Container className="relative text-center">
          <Pill tone="rose">✦ Try it yourself</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Meet the CycleAI coach
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            This is an illustrative preview — tap a sample question below or type
            your own to see how CycleAI would respond using your real logs.
          </p>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="mx-auto max-w-2xl">
          <DemoChat />
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="Under the hood"
            title="What makes these answers different"
            description="CycleAI isn't a generic chatbot — it's designed specifically to reason about cycle, mood, energy, sleep, symptoms, and stress together."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <Card key={c.title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lavender-50 text-xl">
                  {c.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-plum">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{c.desc}</p>
              </Card>
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
          <DisclaimerBanner className="mt-10 text-left" />
        </Container>
      </section>
    </>
  );
}
