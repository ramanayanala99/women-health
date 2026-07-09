import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/blog";
import { Container, Pill, DisclaimerBanner } from "@/components/ui";
import Button from "@/components/Button";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — CycleAI Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <section className="pt-16 pb-24 sm:pt-20">
      <Container className="mx-auto max-w-2xl">
        <Link href="/blog" className="text-sm font-medium text-plum-soft hover:text-rose-deep">
          ← Back to blog
        </Link>

        <div className="mt-6">
          <Pill tone={post.tone}>{post.category}</Pill>
          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-plum sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm font-medium text-plum-faint">
            {post.date} · {post.readTime}
          </p>
        </div>

        <div
          className="mt-8 flex aspect-[16/7] items-center justify-center rounded-[1.75rem] text-6xl"
          style={{ background: "var(--gradient-soft)" }}
        >
          🌸
        </div>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-plum-soft">
          {post.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <DisclaimerBanner className="mt-12" />

        <div className="mt-12 rounded-[2rem] bg-gradient-to-r from-lavender-50 via-blush to-peach-light p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-plum">
            Want CycleAI to notice patterns like this in your own data?
          </h2>
          <div className="mt-6">
            <Button href="/join-beta">Join the Beta →</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
