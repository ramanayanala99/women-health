import type { Metadata } from "next";
import Button from "@/components/Button";
import PhoneMockup from "@/components/PhoneMockup";
import SplashScreen from "@/components/screens/SplashScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import BodyScoreScreen from "@/components/screens/BodyScoreScreen";
import CycleTimelineScreen from "@/components/screens/CycleTimelineScreen";
import LogScreen from "@/components/screens/LogScreen";
import AIChatScreen from "@/components/screens/AIChatScreen";
import InsightsScreen from "@/components/screens/InsightsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import { Container, Pill, SectionHeading, GlowBlob, DisclaimerBanner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mobile App MVP — CycleAI",
  description: "The CycleAI mobile app MVP — splash, welcome, onboarding, Today Dashboard, Cycle Timeline, Log Symptoms, AI Coach, Insights, and Profile, in Fresh Bloom / Aurora White design.",
};

const screens = [
  { title: "Splash", desc: "The first thing you see — calm, confident, and unmistakably CycleAI.", node: <SplashScreen /> },
  { title: "Welcome", desc: "A clear promise before you even sign up: understand your body's pattern.", node: <WelcomeScreen /> },
  { title: "Onboarding", desc: "A few gentle questions — cycle basics, goals, notifications, and privacy consent.", node: <OnboardingScreen /> },
  { title: "Today Dashboard", desc: "Your cycle phase, Body Score, and a daily AI insight, all in one glance.", node: <BodyScoreScreen /> },
  { title: "Cycle Timeline", desc: "A full month at a glance — phases, predictions, fertility window, and logged symptoms.", node: <CycleTimelineScreen /> },
  { title: "Log Symptoms", desc: "Pain, mood, energy, sleep, stress, and cravings — logged in under a minute.", node: <LogScreen /> },
  { title: "AI Coach", desc: "Ask anything, get a calm, cycle-aware answer — always with a safety net.", node: <AIChatScreen showTabBar /> },
  { title: "Insights", desc: "Weekly trends, monthly patterns, and a doctor-friendly report, ready to share.", node: <InsightsScreen /> },
  { title: "Profile", desc: "Account, privacy, notifications, subscription, and full control over your data.", node: <ProfileScreen /> },
];

export default function AppPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="lavender" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="peach" />
        <Container className="relative text-center">
          <Pill tone="lavender">✦ Mobile app MVP</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            CycleAI, in your pocket
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            A calm, considered mobile experience — from your first splash
            screen to daily insights and an AI coach that knows you.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="flex flex-wrap items-end justify-center gap-6 lg:gap-10">
            <PhoneMockup size="small" className="hidden -rotate-6 opacity-90 md:block">
              <WelcomeScreen />
            </PhoneMockup>
            <PhoneMockup size="large">
              <BodyScoreScreen />
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
            description="From splash to profile, CycleAI stays soft, clear, and trustworthy throughout — with a consistent Today / Timeline / Log / Coach / You home."
          />
          <div className="mt-16 grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {screens.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <PhoneMockup>{s.node}</PhoneMockup>
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
