"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const featureCards = [
  {
    icon: "🌍",
    title: "Global Trends, Local Lens",
    body: "See global memes, slang, and moments explained with analogies and context tailored to your country. No more generic summaries—get answers that actually make sense for you.",
  },
  {
    icon: "⚡",
    title: "Instant Context, Zero Confusion",
    body: "Decode viral references, fandom slang, and trending phrases in seconds. Stay in the loop and keep up with conversations, not just catch up.",
  },
  {
    icon: "🎯",
    title: "One Card, All You Need",
    body: "Origin, meaning, cultural impact, and a local analogy—all in a single, beautifully designed card. Share, save, or just get clarity fast.",
  },
];

const examples = ["Skibidi", "Met Gala", "Hanami", "Coachella", "Bundesliga meme"];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(217,107,43,0.2),transparent_35%),radial-gradient(circle_at_82%_16%,rgba(98,172,255,0.2),transparent_38%),radial-gradient(circle_at_65%_84%,rgba(24,20,16,0.12),transparent_36%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-12 md:px-10 md:pt-16">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo_2.png" alt="CultureLens logo" className="h-10 w-10 rounded-lg object-contain" />
          <span className="text-2xl font-bold tracking-tight text-foreground">CultureLens</span>
        </div>
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="mb-4 text-xs tracking-[0.16em] text-ink-soft uppercase">Pop Culture, Decoded Fast</p>
            <h1 className="max-w-2xl text-4xl leading-[0.98] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Translate the internet. Catch the vibe instantly.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink-soft sm:text-lg">
              From viral slang to global moments, CultureLens gives you the origin, the meaning, and the local equivalent in one hit.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="btn-primary px-6 py-3 text-sm font-semibold"
              >
                Try now
              </Link>
              <a
                href="https://github.com/nikhilagarwal03/CultureLens"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-6 py-3 text-sm font-semibold flex items-center gap-2 justify-center"
                aria-label="Star on GitHub"
              >
                <svg height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="inline-block mr-1"><path d="M8 12.027l-3.717 2.21.711-4.15-3.02-2.944 4.17-.606L8 2.5l1.856 3.937 4.17.606-3.02 2.944.711 4.15z"></path></svg>
                Star on GitHub
              </a>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-panel p-6 shadow-[0_16px_44px_rgba(24,20,16,0.18)] ring-1 ring-black/10"
          >
            <p className="text-xs font-medium tracking-[0.14em] text-ink-soft uppercase">Quick prompts</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {examples.map((item) => (
                <li key={item} className="tag-chip px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-2)_62%,#000),color-mix(in_srgb,var(--accent)_56%,#000))] p-4 text-white">
              <p className="text-sm font-semibold tracking-wide">Output format</p>
              <p className="mt-2 text-sm/6 text-white/90">
                Reference, cultural impact, origin context, and local analogy in one compact card.
              </p>
            </div>
          </motion.aside>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {featureCards.map((card, idx) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
              className="rounded-2xl bg-panel p-6 ring-1 ring-black/10 flex flex-col items-start shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated text-2xl text-accent shadow">
                  {card.icon}
                </span>
                <div className="h-2 w-12 rounded-[2px] bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">{card.title}</h2>
              <p className="text-sm leading-6 text-ink-soft">{card.body}</p>
            </motion.article>
          ))}
        </section>
      </main>
    </div>
  );
}
