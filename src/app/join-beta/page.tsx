import type { Metadata } from "next";
import JoinBetaForm from "@/components/JoinBetaForm";
import { Container, Pill, GlowBlob } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join the Beta — CycleAI",
  description: "Request early access to CycleAI — the AI Women's Health Operating System. Free during beta, privacy-first, always.",
};

const perks = [
  { icon: "✦", title: "Full Premium access", desc: "Every beta member gets extended free access to the complete AI coach experience." },
  { icon: "🗣️", title: "Direct influence", desc: "Your feedback shapes what we build next — this is a product made with our community, not just for it." },
  { icon: "🔒", title: "Privacy from day one", desc: "The same encrypted, never-sold data promise applies from your very first log." },
];

export default function JoinBetaPage() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-20">
      <GlowBlob className="-left-24 -top-16 h-80 w-80" color="lavender" />
      <GlowBlob className="-right-20 top-40 h-72 w-72" color="rose" />
      <Container className="relative grid gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          <Pill tone="lavender">✦ Limited early access</Pill>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Join the CycleAI beta
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-plum-soft">
            Be among the first to experience an AI that actually understands
            your whole body — free, private, and built with women like you.
          </p>

          <div className="mt-10 space-y-5">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blush text-lg">
                  {p.icon}
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-plum">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-plum-soft">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs leading-relaxed text-plum-faint">
            CycleAI provides educational and wellness guidance only, and does
            not diagnose or treat medical conditions. Your information is
            used solely to manage your beta access and is never sold.
          </p>
        </div>

        <JoinBetaForm />
      </Container>
    </section>
  );
}
