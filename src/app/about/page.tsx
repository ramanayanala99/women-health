import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, SectionHeading, GlowBlob, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — CycleAI",
  description: "Why we're building CycleAI — a privacy-first AI Women's Health Operating System designed to help women understand their bodies with clarity and calm.",
};

const values = [
  {
    icon: "🩶",
    title: "Privacy is non-negotiable",
    desc: "Health data is deeply personal. We design every feature assuming it should never leave your control.",
  },
  {
    icon: "🌿",
    title: "Educate, never diagnose",
    desc: "We give women clarity and language for their own patterns — and know exactly where our role ends and a doctor's begins.",
  },
  {
    icon: "🎨",
    title: "Beauty is respect",
    desc: "A calm, considered design isn't decoration — it's a sign we take the person on the other side of the screen seriously.",
  },
  {
    icon: "🔬",
    title: "Grounded in real science",
    desc: "Every insight is shaped by established reproductive health knowledge, not trends or guesswork.",
  },
];

const team = [
  { initial: "E", name: "Elena", role: "Founder & CEO" },
  { initial: "M", name: "Maya", role: "Head of AI" },
  { initial: "R", name: "Riya", role: "Head of Design" },
  { initial: "S", name: "Sofia", role: "Clinical Advisor, OB-GYN" },
  { initial: "A", name: "Amara", role: "Head of Privacy & Security" },
  { initial: "J", name: "Jade", role: "Behavioral Health Advisor" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="rose" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="sky" />
        <Container className="relative text-center">
          <Pill tone="rose">Our story</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Women deserve better tools to understand their own bodies
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-plum-soft">
            Most period trackers stop at a calendar. We started CycleAI to ask
            a bigger question: what if your cycle, mood, energy, sleep, and
            stress could all be understood together — calmly, privately, and
            personally?
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-plum-soft">
          <p>
            CycleAI began with a simple frustration: existing apps treated the
            menstrual cycle as an isolated event, disconnected from mood,
            energy, sleep, and stress — even though anyone who has lived in a
            body knows they&apos;re deeply connected.
          </p>
          <p>
            We set out to build something different — an AI Women&apos;s
            Health Operating System that feels as considered as the products
            women already love, and as trustworthy as the healthcare
            professionals they rely on. Soft where hospitals feel sterile.
            Clear where wellness apps get vague. Private by default, not by
            afterthought.
          </p>
          <p>
            CycleAI is still early — we&apos;re building it in the open with a
            beta community, real clinical input, and a firm belief that
            understanding your body shouldn&apos;t require a medical degree or
            a compromise on privacy.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="What we believe" title="The values behind every decision" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blush text-xl">
                  {v.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-plum">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">{v.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="The team" title="Building CycleAI, together" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((t) => (
              <Card key={t.name} className="flex items-center gap-4">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-lg font-semibold text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {t.initial}
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-plum">{t.name}</p>
                  <p className="text-sm text-plum-soft">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              Help us build the future of women&apos;s health
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/join-beta" size="lg">Join the Beta →</Button>
              <Button href="/blog" variant="secondary" size="lg">Read our blog</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
