"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Pill, GlowBlob } from "@/components/ui";
import { register, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { access_token } = await register(email, password, fullName);
      setToken(access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-20">
      <GlowBlob className="-left-24 -top-16 h-80 w-80" color="mint" />
      <GlowBlob className="-right-20 top-32 h-72 w-72" color="peach" />
      <Container className="relative mx-auto max-w-md">
        <div className="text-center">
          <Pill tone="mint">✦ Create your account</Pill>
          <h1 className="mt-6 font-display text-3xl font-semibold text-plum sm:text-4xl">
            Join CycleAI
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-plum-soft">
            Set up your account to start logging your cycle, symptoms, and
            chatting with your AI coach.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card mt-10 space-y-5 rounded-[2rem] p-8">
          {error && (
            <p className="rounded-xl bg-blush/60 px-4 py-3 text-sm font-medium text-rose-deep">
              {error}
            </p>
          )}
          <div>
            <label className="text-sm font-semibold text-plum" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ava Chen"
              className="mt-2 w-full rounded-xl border border-lavender-100 bg-white/80 px-4 py-3 text-sm text-plum outline-none placeholder:text-plum-faint focus:border-rose-light"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="mt-2 w-full rounded-xl border border-lavender-100 bg-white/80 px-4 py-3 text-sm text-plum outline-none placeholder:text-plum-faint focus:border-rose-light"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-gradient w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-xs leading-relaxed text-plum-faint">
            CycleAI provides educational and wellness guidance only, and does
            not diagnose or treat medical conditions.
          </p>
        </form>

        <p className="mt-8 text-center text-sm text-plum-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-rose-deep hover:underline">
            Log in
          </Link>
        </p>
      </Container>
    </section>
  );
}
