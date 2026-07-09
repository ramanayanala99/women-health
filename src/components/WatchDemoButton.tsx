"use client";

import { useState } from "react";
import Link from "next/link";

export default function WatchDemoButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-lavender-100 bg-white/80 px-6 py-3 text-sm font-semibold text-plum shadow-sm transition-all hover:border-rose-light hover:shadow-md"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: "var(--gradient-primary)" }}>
          ▶
        </span>
        Watch 90 sec demo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-plum/40 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md rounded-[2rem] p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto grid h-16 w-16 place-items-center rounded-full text-2xl text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              ▶
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-plum">
              Our 90-second demo is on its way
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-plum-soft">
              We&apos;re polishing the walkthrough video. In the meantime, try
              the real, interactive AI demo — it&apos;s more fun anyway.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/ai-demo"
                className="btn-gradient rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Try CycleAI Demo →
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-lavender-100 bg-white/80 px-6 py-3 text-sm font-semibold text-plum-soft"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
