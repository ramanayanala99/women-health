export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tone: "lavender" | "rose" | "mint" | "peach" | "sky";
  readTime: string;
  date: string;
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "four-phases-of-your-cycle",
    title: "Understanding the Four Phases of Your Cycle",
    excerpt:
      "Your cycle is more than a period date — it's a month-long story told in four hormonal chapters. Here's what each one tends to mean.",
    category: "Science",
    tone: "lavender",
    readTime: "6 min read",
    date: "Jun 2, 2026",
    content: [
      "Most of us learn to think about our cycle as a single event: the period. But physiologically, a cycle unfolds in four distinct phases — menstrual, follicular, ovulation, and luteal — each shaped by a different balance of estrogen and progesterone.",
      "During the menstrual phase, both hormones are low, which is often why energy can feel at its lowest too. As the follicular phase begins, estrogen starts climbing, frequently bringing a gradual lift in mood and energy.",
      "Ovulation marks a hormonal peak, and many people notice increased energy, confidence, and sociability around this window. Afterward, the luteal phase brings a rise and eventual fall in progesterone — often the source of pre-period mood and sleep changes.",
      "None of this is universal or exact — cycles vary widely between people and even cycle to cycle. But understanding the general shape of these four phases can make your own patterns feel less random and more like a story you're learning to read.",
      "This is exactly the kind of pattern CycleAI is built to help you notice in your own data, gently and without judgment.",
    ],
  },
  {
    slug: "sleep-and-your-cycle",
    title: "Why Sleep and Your Cycle Are More Connected Than You Think",
    excerpt:
      "Hormonal shifts across your cycle can quietly reshape your sleep — and poor sleep can shift your mood and energy right back.",
    category: "Sleep",
    tone: "sky",
    readTime: "5 min read",
    date: "May 18, 2026",
    content: [
      "Sleep doesn't happen in isolation from the rest of your body. Rising progesterone in the luteal phase is often mildly sedating for some people, while its drop right before your period can disrupt sleep quality for others.",
      "At the same time, poor sleep can amplify mood sensitivity and reduce next-day energy — creating a loop that's easy to blame on 'just a bad week' rather than a pattern worth understanding.",
      "Small, consistent habits tend to help most: a steady wind-down routine, limiting late caffeine, and gentle evening movement. But the first step is simply noticing the pattern.",
      "That's why CycleAI treats sleep as a core signal, not an afterthought — logging it alongside mood and energy so the connections become visible over time.",
    ],
  },
  {
    slug: "stress-and-hormones",
    title: "How Stress Quietly Shapes Your Hormones",
    excerpt:
      "Chronic stress and your reproductive hormones are in constant conversation. Here's a gentle primer on what that means for your cycle.",
    category: "Stress",
    tone: "mint",
    readTime: "5 min read",
    date: "Apr 27, 2026",
    content: [
      "The stress hormone cortisol and reproductive hormones share overlapping signaling pathways in the body. In periods of prolonged stress, this can sometimes show up as changes in cycle timing, symptom intensity, or sleep quality.",
      "This doesn't mean stress causes every irregular cycle — many factors are at play — but it's a well-documented influence worth paying attention to.",
      "Simple stress-regulation practices, like brief breathing exercises or short walks, can help build resilience over time. The goal isn't to eliminate stress, but to notice it and respond to it with intention.",
      "CycleAI's daily stress check-ins exist for exactly this reason: to help you see how stress and your cycle move together over weeks and months, not just today.",
    ],
  },
  {
    slug: "gentle-symptom-tracking-habit",
    title: "Building a Gentle Symptom-Tracking Habit That Actually Sticks",
    excerpt:
      "The best tracking habit isn't the most detailed one — it's the one you'll actually keep doing. Here's how to make it effortless.",
    category: "Habits",
    tone: "rose",
    readTime: "4 min read",
    date: "Apr 9, 2026",
    content: [
      "Many people abandon symptom tracking within a few weeks — not from lack of motivation, but because the habit felt like homework. Long forms and clinical checklists ask too much of a tired evening.",
      "A sustainable habit is small: a handful of taps, once a day, at a time that already exists in your routine — like brushing your teeth or getting into bed.",
      "Consistency matters more than completeness. A few logged days each week, kept up over months, teaches CycleAI far more than a single exhaustive entry.",
      "That's why every CycleAI log screen is designed around speed and simplicity first — because the most valuable data is the data you'll actually keep providing.",
    ],
  },
  {
    slug: "what-mood-swings-tell-you",
    title: "What Your Mood Swings Might Be Telling You",
    excerpt:
      "Mood shifts across your cycle aren't 'just hormones' to dismiss — they're often information worth listening to.",
    category: "Mood",
    tone: "rose",
    readTime: "5 min read",
    date: "Mar 22, 2026",
    content: [
      "It's common to hear mood changes across the cycle dismissed with a shrug — 'it's just hormones.' But that framing can obscure something useful: your emotional patterns often follow a legible rhythm worth understanding.",
      "For many, irritability or low mood cluster in the days before a period, while confidence and sociability often rise around ovulation. Recognizing your own version of this rhythm can make difficult days feel more explainable and less isolating.",
      "It's also worth knowing when a pattern crosses into something that deserves extra support — significant mood disruption that affects daily life is worth discussing with a healthcare professional, not just tracking alone.",
      "CycleAI's mood correlation view is designed to help you see your own rhythm clearly, while always encouraging professional support when a pattern looks like it needs more than self-tracking.",
    ],
  },
  {
    slug: "privacy-in-womens-health-apps",
    title: "Privacy in Women's Health Apps: Why It Matters More Than Ever",
    excerpt:
      "Health data is uniquely sensitive — and women's health data even more so. Here's why we built CycleAI privacy-first from day one.",
    category: "Privacy",
    tone: "peach",
    readTime: "6 min read",
    date: "Mar 4, 2026",
    content: [
      "Reproductive health data can reveal deeply personal information — from fertility intentions to symptoms someone may not have shared with anyone else. That sensitivity demands a higher bar for how it's handled.",
      "Too many health apps have historically treated user data as a monetizable asset. We believe that's fundamentally the wrong model for something this personal.",
      "CycleAI is built around a simple standard: your data is encrypted, never sold, exportable on demand, and deletable without friction or guilt-tripping.",
      "Privacy isn't a feature we bolted on — it's a constraint we designed around from the very first line of code.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
