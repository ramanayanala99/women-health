import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";
import { Container, Pill, GlowBlob } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog — CycleAI",
  description: "Calm, educational reads on cycle science, mood, sleep, stress, and privacy in women's health.",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <GlowBlob className="-left-24 -top-16 h-80 w-80" color="rose" />
        <GlowBlob className="-right-20 top-32 h-72 w-72" color="lavender" />
        <Container className="relative text-center">
          <Pill tone="rose">The CycleAI journal</Pill>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight text-plum sm:text-5xl">
            Calm reads on your cycle, body, and mind
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-plum-soft">
            Educational articles on the science, habits, and privacy behind
            women&apos;s health — never clinical, always clear.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <Link
            href={`/blog/${featured.slug}`}
            className="glass-card group grid gap-8 rounded-[2rem] p-8 transition-transform hover:-translate-y-1 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:p-10"
          >
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] text-6xl"
              style={{ background: "var(--gradient-soft)" }}
            >
              🌙
            </div>
            <div>
              <Pill tone={featured.tone}>{featured.category}</Pill>
              <h2 className="mt-4 font-display text-2xl font-semibold text-plum group-hover:text-rose-deep sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-plum-soft">{featured.excerpt}</p>
              <p className="mt-5 text-xs font-medium text-plum-faint">
                {featured.date} · {featured.readTime}
              </p>
            </div>
          </Link>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="glass-card group flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <Pill tone={p.tone}>{p.category}</Pill>
                <h3 className="mt-4 font-display text-lg font-semibold text-plum group-hover:text-rose-deep">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-plum-soft">{p.excerpt}</p>
                <p className="mt-5 text-xs font-medium text-plum-faint">
                  {p.date} · {p.readTime}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
