"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Pill, GlowBlob, Card, DisclaimerBanner } from "@/components/ui";
import { getDashboard, DashboardOut, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const PHASE_LABELS: Record<string, string> = {
  menstrual: "Menstrual phase",
  follicular: "Follicular phase",
  ovulation: "Ovulation",
  luteal: "Luteal phase",
  irregular: "Irregular pattern",
  perimenopause: "Perimenopause",
  menopause: "Menopause",
  postmenopause: "Postmenopause",
};

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, loading: authLoading, logout } = useAuth();
  const [data, setData] = useState<DashboardOut | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    getDashboard(token)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Something went wrong."))
      .finally(() => setLoading(false));
  }, [authLoading, token, router]);

  if (authLoading || loading) {
    return (
      <Container className="py-24 text-center text-sm text-plum-soft">
        Loading your dashboard…
      </Container>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="rose" />
        <Container className="relative mx-auto max-w-lg text-center">
          <Pill tone="rose">✦ Connection issue</Pill>
          <h1 className="mt-6 font-display text-2xl font-semibold text-plum">
            Couldn&apos;t load your dashboard
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-plum-soft">{error}</p>
        </Container>
      </section>
    );
  }

  if (!data) return null;

  const { forecast } = data;
  const stats = [
    { label: "Energy", value: data.recent_energy != null ? `${data.recent_energy}/5` : "—" },
    { label: "Mood", value: data.recent_mood != null ? `${data.recent_mood}/5` : "—" },
    { label: "Sleep", value: data.recent_sleep_hours != null ? `${data.recent_sleep_hours}h` : "—" },
    { label: "Stress", value: data.recent_stress != null ? `${data.recent_stress}/5` : "—" },
  ];

  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-20">
      <GlowBlob className="-left-24 -top-16 h-80 w-80" color="lavender" />
      <GlowBlob className="-right-20 top-40 h-72 w-72" color="mint" />
      <Container className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill tone="lavender">✦ Your dashboard</Pill>
            <h1 className="mt-4 font-display text-3xl font-semibold text-plum sm:text-4xl">
              {data.greeting}
            </h1>
            {user && <p className="mt-2 text-sm text-plum-soft">{user.email}</p>}
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-full border border-lavender-100 bg-white/80 px-5 py-2.5 text-sm font-semibold text-plum hover:border-rose-light"
          >
            Log out
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
              Cycle forecast
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-plum">
              {forecast.current_phase ? PHASE_LABELS[forecast.current_phase] ?? forecast.current_phase : "No data yet"}
            </h2>
            {forecast.has_data ? (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-plum-soft sm:grid-cols-3">
                {forecast.current_cycle_day != null && (
                  <div>
                    <p className="text-plum-faint">Cycle day</p>
                    <p className="mt-1 font-semibold text-plum">{forecast.current_cycle_day}</p>
                  </div>
                )}
                {forecast.days_until_next_period != null && (
                  <div>
                    <p className="text-plum-faint">Next period in</p>
                    <p className="mt-1 font-semibold text-plum">{forecast.days_until_next_period} days</p>
                  </div>
                )}
                <div>
                  <p className="text-plum-faint">Confidence</p>
                  <p className="mt-1 font-semibold text-plum">{Math.round(forecast.confidence * 100)}%</p>
                </div>
              </div>
            ) : null}
            <p className="mt-4 text-sm leading-relaxed text-plum-soft">{forecast.note}</p>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
              Today&apos;s stats
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-plum-faint">{s.label}</p>
                  <p className="mt-1 font-display text-xl font-semibold text-plum">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {data.recommendations.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold text-plum">Recommendations for you</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.recommendations.map((r) => (
                <Card key={r.title}>
                  <span className="text-xl">{r.icon}</span>
                  <p className="mt-3 font-semibold text-plum">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-plum-soft">{r.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <DisclaimerBanner className="mt-10" />
      </Container>
    </section>
  );
}
