import type { Metadata } from "next";
import Link from "next/link";
import { Container, Pill, GlowBlob } from "@/components/ui";

export const metadata: Metadata = {
  title: "Log in — CycleAI",
  description: "Log in to your CycleAI account.",
};

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-20">
      <GlowBlob className="-left-24 -top-16 h-80 w-80" color="lavender" />
      <GlowBlob className="-right-20 top-32 h-72 w-72" color="rose" />
      <Container className="relative mx-auto max-w-md">
        <div className="text-center">
          <Pill tone="lavender">✦ Welcome back</Pill>
          <h1 className="mt-6 font-display text-3xl font-semibold text-plum sm:text-4xl">
            Log in to CycleAI
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-plum-soft">
            CycleAI is currently in private beta — accounts open as beta seats
            are activated.
          </p>
        </div>

        <form className="glass-card mt-10 space-y-5 rounded-[2rem] p-8">
          <div>
            <label className="text-sm font-semibold text-plum" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-lavender-100 bg-white/80 px-4 py-3 text-sm text-plum outline-none placeholder:text-plum-faint focus:border-rose-light"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-lavender-100 bg-white/80 px-4 py-3 text-sm text-plum outline-none placeholder:text-plum-faint focus:border-rose-light"
            />
          </div>
          <button
            type="submit"
            className="btn-gradient w-full rounded-full py-3.5 text-sm font-semibold text-white"
          >
            Log in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-plum-soft">
          Don&apos;t have an account?{" "}
          <Link href="/join-beta" className="font-semibold text-rose-deep hover:underline">
            Join the beta
          </Link>
        </p>
      </Container>
    </section>
  );
}
