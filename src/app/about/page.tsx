import type { Metadata } from "next";
import Button from "@/components/Button";
import { Container, Pill, SectionHeading, GlowBlob, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — CycleAI",
  description: "We believe every woman deserves to understand her body. The mission, vision, values, and long-term roadmap behind CycleAI.",
};

const values = [
  { icon: "🤝", title: "Trust", desc: "Every interaction is designed to earn and keep your confidence, not just your attention." },
  { icon: "🔒", title: "Privacy", desc: "Your health data is yours — encrypted, controlled, and never sold." },
  { icon: "💗", title: "Compassion", desc: "We build for real bodies, real days, and real emotions — never judgment." },
  { icon: "🔬", title: "Scientific responsibility", desc: "Every insight is grounded in evidence and honest about its limits." },
  { icon: "✨", title: "Beautiful simplicity", desc: "Complex science, explained simply — calm design over clinical clutter." },
  { icon: "🧭", title: "User control", desc: "You decide what's tracked, what's shared, and what's deleted. Always." },
];

const roadmap = [
  { title: "Menstrual health", desc: "Understanding your cycle, mood, energy, and symptoms.", status: "Available now" },
  { title: "Fertility awareness", desc: "Supporting those trying to understand their fertile window.", status: "On the roadmap" },
  { title: "Pregnancy", desc: "Guidance and tracking built for the nine months ahead.", status: "On the roadmap" },
  { title: "Postpartum", desc: "Support for recovery, mood, and the return to your rhythm.", status: "On the roadmap" },
  { title: "Perimenopause", desc: "Making sense of the transition years, with clarity instead of confusion.", status: "On the roadmap" },
  { title: "Menopause", desc: "Wellness guidance for a new chapter of your body's story.", status: "On the roadmap" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="rose" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="sky" />
        <Container className="relative text-center">
          <Pill tone="rose">Our story</Pill>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            We believe every woman deserves to understand her body.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-plum-soft">
            An AI Women&apos;s Health Operating System, built to explain what
            your body is telling you — before symptoms happen.
          </p>
        </Container>
      </section>

      {/* STORY */}
      <section className="pb-20">
        <Container className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-plum-soft sm:text-lg">
            Every month, millions of women experience changes in energy,
            mood, pain, sleep, cravings, and stress. Most apps only track
            dates.
          </p>
          <p className="mt-5 font-display text-xl leading-relaxed text-plum sm:text-2xl">
            CycleAI was created to help women understand patterns, prepare
            earlier, and feel more in control.
          </p>
        </Container>
      </section>

      {/* FOUNDER NOTE */}
      <section className="pb-20">
        <Container className="mx-auto max-w-3xl">
          <div className="glass-card rounded-[2rem] p-8 sm:p-10">
            <span className="text-3xl text-lavender-300">&ldquo;</span>
            <p className="mt-2 font-display text-lg leading-relaxed text-plum sm:text-xl">
              I built CycleAI because I was tired of tools that only counted
              days. Every woman deserves an app that understands the whole
              picture — mood, energy, sleep, stress — not just a calendar.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-full text-base font-semibold text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                E
              </span>
              <div>
                <p className="text-sm font-semibold text-plum">Elena</p>
                <p className="text-xs text-plum-faint">Founder & CEO, CycleAI</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MISSION & VISION */}
      <section className="pb-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-gradient-to-br from-lavender-50 to-blush p-8 sm:p-10">
              <Pill tone="lavender">Our mission</Pill>
              <p className="mt-5 font-display text-2xl font-semibold leading-snug text-plum sm:text-3xl">
                &ldquo;Help women understand their bodies before symptoms
                happen.&rdquo;
              </p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-sky-light to-mint-light p-8 sm:p-10">
              <Pill tone="sky">Our vision</Pill>
              <p className="mt-5 font-display text-2xl font-semibold leading-snug text-plum sm:text-3xl">
                &ldquo;Build the world&apos;s most trusted AI Women&apos;s
                Health Operating System.&rdquo;
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* VALUES */}
      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="What we believe" title="The values behind every decision" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ROADMAP */}
      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="Where we're headed"
            title="A lifelong companion, not just a phase"
            description="CycleAI starts with the menstrual cycle — and is built to grow alongside every stage of a woman's life."
          />
          <div className="relative mt-16">
            <div className="absolute left-4 top-2 bottom-2 hidden w-px bg-lavender-100 sm:block lg:left-1/2" />
            <div className="grid gap-6 sm:grid-cols-2">
              {roadmap.map((r, i) => (
                <div key={r.title} className={`relative pl-10 sm:pl-0 ${i % 2 === 0 ? "lg:pr-10 lg:text-right" : "lg:col-start-2 lg:pl-10"}`}>
                  <span
                    className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full sm:left-2.5 lg:left-auto ${
                      i % 2 === 0 ? "lg:-right-[7px]" : "lg:-left-[7px]"
                    }`}
                    style={{ background: "var(--gradient-primary)" }}
                  />
                  <div className="glass-card rounded-2xl p-6">
                    <Pill tone={r.status === "Available now" ? "mint" : "lavender"}>{r.status}</Pill>
                    <h3 className="mt-4 font-display text-lg font-semibold text-plum">{r.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-plum-soft">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
