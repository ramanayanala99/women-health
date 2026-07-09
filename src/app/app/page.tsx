import type { Metadata } from "next";
import Button from "@/components/Button";
import PhoneMockup from "@/components/PhoneMockup";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import TodayScreen from "@/components/screens/TodayScreen";
import LogScreen from "@/components/screens/LogScreen";
import InsightsScreen from "@/components/screens/InsightsScreen";
import AIChatScreen from "@/components/screens/AIChatScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import { Container, Pill, SectionHeading, GlowBlob, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mobile App — CycleAI",
  description: "A first look at the CycleAI iOS app — onboarding, today view, logging, insights, AI coach, and privacy controls.",
};

const screens = [
  { title: "Welcome", desc: "A calm first impression that sets expectations honestly from the very first screen.", node: <OnboardingScreen /> },
  { title: "Today", desc: "Your cycle phase, quick logging, and a daily AI insight — all in one gentle glance.", node: <TodayScreen /> },
  { title: "Log", desc: "Mood, symptoms, and sleep captured in a few taps, designed for real, tired evenings.", node: <LogScreen /> },
  { title: "Insights", desc: "Patterns and correlations across your cycle, sleep, mood, and energy — visualized simply.", node: <InsightsScreen /> },
  { title: "AI Coach", desc: "A natural conversation with context from your own history, always clear about its limits.", node: <AIChatScreen /> },
  { title: "Privacy", desc: "Every data control front and center — encryption, export, and delete, always accessible.", node: <SettingsScreen /> },
];

export default function AppPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="lavender" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="peach" />
        <Container className="relative text-center">
          <Pill tone="lavender">✦ On iOS &amp; Android</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            CycleAI, in your pocket
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            A calm, considered mobile experience — from your first onboarding
            screen to daily insights and an AI coach that knows you.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="flex flex-wrap items-end justify-center gap-6 lg:gap-10">
            <PhoneMockup size="small" className="hidden -rotate-6 opacity-90 md:block">
              <OnboardingScreen />
            </PhoneMockup>
            <PhoneMockup>
              <TodayScreen />
            </PhoneMockup>
            <PhoneMockup size="small" className="hidden rotate-6 opacity-90 md:block">
              <AIChatScreen />
            </PhoneMockup>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Screen by screen"
            title="Every screen, designed with the same calm intention"
            description="From onboarding to privacy settings, CycleAI stays soft, clear, and trustworthy throughout."
          />
          <div className="mt-16 grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {screens.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <PhoneMockup size="small">{s.node}</PhoneMockup>
                <h3 className="mt-6 font-display text-lg font-semibold text-plum">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-plum-soft">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="text-center">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-10 sm:p-14">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-plum sm:text-4xl">
              The app is opening to beta members soon
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-plum-soft">
              Join now to get early access as soon as CycleAI opens up on iOS
              and Android.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/join-beta" size="lg">Join the Beta →</Button>
              <Button href="/features" variant="secondary" size="lg">Explore features</Button>
            </div>
          </div>
          <DisclaimerBanner className="mt-10 text-left" />
        </Container>
      </section>
    </>
  );
}
