import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/ai-demo", label: "AI Demo" },
      { href: "/app", label: "Mobile App" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/science", label: "AI Science" },
      { href: "/blog", label: "Blog" },
      { href: "/join-beta", label: "Join Beta" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/privacy", label: "Privacy Promise" },
      { href: "/science", label: "Medical Disclaimer" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-lavender-100/60 bg-gradient-to-b from-white to-blush">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold">
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-white text-sm"
                style={{ background: "var(--gradient-primary)" }}
              >
                ✦
              </span>
              Cycle<span className="gradient-text">AI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-plum-soft">
              An AI Women&apos;s Health Operating System. Understand your body
              before it changes.
            </p>
            <p className="mt-6 text-xs leading-relaxed text-plum-faint max-w-xs">
              CycleAI provides educational and wellness guidance only. It does
              not diagnose, treat, or replace advice from a licensed
              healthcare professional. If symptoms are severe, persistent, or
              unusual, please consult a doctor.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-plum-faint">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-plum-soft transition-colors hover:text-rose-deep"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-lavender-100/60 pt-8 text-xs text-plum-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} CycleAI. Your data belongs to you — always.</p>
          <div className="flex gap-6">
            <span>🔒 End-to-end encrypted</span>
            <span>🚫 Never sold</span>
            <span>🩺 Not a medical device</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
