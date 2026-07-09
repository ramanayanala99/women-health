"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/nav";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { token, logout } = useAuth();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-pearl/80 backdrop-blur-xl border-b border-lavender-100/60" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full text-white text-sm" style={{ background: "var(--gradient-primary)" }}>
            ✦
          </span>
          Cycle<span className="gradient-text">AI</span>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-rose-deep" : "text-plum-soft hover:text-plum"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-5 xl:flex">
          {token ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/dashboard" ? "text-rose-deep" : "text-plum-soft hover:text-plum"
                }`}
              >
                Dashboard
              </Link>
              <Button size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/login" ? "text-rose-deep" : "text-plum-soft hover:text-plum"
                }`}
              >
                Log in
              </Link>
              <Button href="/join-beta" size="sm">
                Join Beta
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-lavender-100 bg-white/70 xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-plum transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-plum transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-plum transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="relative border-t border-lavender-100/60 bg-pearl/95 backdrop-blur-xl xl:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                  pathname === link.href ? "bg-blush text-rose-deep" : "text-plum-soft hover:bg-blush/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {token ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                    pathname === "/dashboard" ? "bg-blush text-rose-deep" : "text-plum-soft hover:bg-blush/60"
                  }`}
                >
                  Dashboard
                </Link>
                <Button className="mt-2 w-full" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                    pathname === "/login" ? "bg-blush text-rose-deep" : "text-plum-soft hover:bg-blush/60"
                  }`}
                >
                  Log in
                </Link>
                <Button href="/join-beta" className="mt-2 w-full">
                  Join Beta
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
