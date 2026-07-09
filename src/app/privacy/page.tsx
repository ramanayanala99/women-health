import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, SectionHeading, GlowBlob, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Promise — CycleAI",
  description: "CycleAI's privacy promise — your health data belongs to you, is never sold, and stays under your control.",
};

const commitments = [
  { icon: "🔐", title: "Encrypted, always", desc: "Your logs are encrypted in transit and at rest, using industry-standard encryption." },
  { icon: "🚫", title: "Never sold", desc: "We never sell your identifiable health data to advertisers, brokers, or anyone else. Permanently." },
  { icon: "🧭", title: "You control access", desc: "Export your full history anytime, in a portable format, with no waiting period." },
  { icon: "🗑️", title: "Real deletion", desc: "Ask us to delete your data and it's gone — not just hidden, not retained quietly." },
  { icon: "🙈", title: "Minimal by default", desc: "We only collect what's needed to power the features you actually use." },
  { icon: "🩺", title: "Never a diagnosis on record", desc: "CycleAI's guidance is educational — we don't create or share medical diagnoses." },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="mint" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="lavender" />
        <Container className="relative text-center">
          <Pill tone="mint">🔒 A permanent promise</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Your body. Your data. Always yours.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            Women&apos;s health data is uniquely sensitive. We built CycleAI on
            the belief that privacy should never be a paid upgrade or an
            afterthought.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="Our commitments" title="What privacy actually means at CycleAI" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c) => (
              <Card key={c.title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-light text-xl">
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
              Questions about how your data is handled?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/about" size="lg">Meet the team</Button>
              <Button href="/join-beta" variant="secondary" size="lg">Join the beta</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
