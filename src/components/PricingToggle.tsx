"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { Pill } from "@/components/ui";

const tiers = [
  {
    name: "Essential",
    tagline: "Start understanding your body",
    monthly: 0,
    yearly: 0,
    featured: false,
    features: [
      "Cycle & ovulation tracking",
      "Mood & energy logging",
      "Basic symptom tracking",
      "7-day insight history",
    ],
  },
  {
    name: "Premium",
    tagline: "The full CycleAI experience",
    monthly: 9.99,
    yearly: 79,
    featured: true,
    features: [
      "Everything in Essential",
      "Full AI coach & unlimited chat",
      "Deep pattern & correlation insights",
      "Unlimited history",
      "Sleep & stress modules",
      "Priority support",
    ],
  },
  {
    name: "Together",
    tagline: "Share understanding with your circle",
    monthly: 14.99,
    yearly: 119,
    featured: false,
    features: [
      "Everything in Premium",
      "Up to 4 connected profiles",
      "Partner-friendly summaries",
      "Family wellness digest",
    ],
  },
];

export default function PricingToggle() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full border border-lavender-100 bg-white/70 p-1.5">
        <button
          onClick={() => setYearly(false)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            !yearly ? "text-white" : "text-plum-soft"
          }`}
          style={!yearly ? { background: "var(--gradient-primary)" } : {}}
        >
          Monthly
        </button>
        <button
          onClick={() => setYearly(true)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            yearly ? "text-white" : "text-plum-soft"
          }`}
          style={yearly ? { background: "var(--gradient-primary)" } : {}}
        >
          Yearly · Save ~20%
        </button>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-[2rem] p-8 ${
              t.featured
                ? "text-white shadow-2xl lg:-translate-y-4"
                : "glass-card"
            }`}
            style={t.featured ? { background: "var(--gradient-primary)" } : {}}
          >
            {t.featured && (
              <span className="absolute -top-3 right-8">
                <Pill tone="peach">✦ Most loved</Pill>
              </span>
            )}
            <p className={`text-sm font-semibold ${t.featured ? "text-white/80" : "text-plum-faint"}`}>
              {t.tagline}
            </p>
            <h3 className={`mt-1 font-display text-2xl font-semibold ${t.featured ? "text-white" : "text-plum"}`}>
              {t.name}
            </h3>
            <div className="mt-6 flex items-end gap-1">
              <span className={`font-display text-4xl font-semibold ${t.featured ? "text-white" : "text-plum"}`}>
                {t.monthly === 0 ? "Free" : `$${yearly ? (t.yearly / 12).toFixed(2) : t.monthly}`}
              </span>
              {t.monthly !== 0 && (
                <span className={`pb-1 text-sm ${t.featured ? "text-white/70" : "text-plum-faint"}`}>/mo</span>
              )}
            </div>
            {t.monthly !== 0 && yearly && (
              <p className={`mt-1 text-xs ${t.featured ? "text-white/70" : "text-plum-faint"}`}>
                billed ${t.yearly} yearly
              </p>
            )}
            <ul className="mt-7 space-y-3">
              {t.features.map((f) => (
                <li key={f} className={`flex items-start gap-2.5 text-sm ${t.featured ? "text-white/90" : "text-plum-soft"}`}>
                  <span>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              href="/join-beta"
              variant={t.featured ? "secondary" : "primary"}
              className={`mt-8 w-full ${t.featured ? "!bg-white !text-plum" : ""}`}
            >
              {t.monthly === 0 ? "Get started free" : "Join the Beta"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
