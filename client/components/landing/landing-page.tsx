"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useAppState } from "@/components/providers/app-provider";
import { resolveDashboardHref } from "@/lib/client/navigation";

const PILLARS = [
  {
    num: "01",
    tag: "ETYMOLOGY",
    title: "Genealogy & Source",
    body: "Pinpoint where the expression emerged, tracing its root path through digital subcultures.",
  },
  {
    num: "02",
    tag: "TRANSLATION",
    title: "Cultural Counterparts",
    body: "Re-frame foreign vernacular through analogies, idioms, and social parallels native to your region.",
  },
  {
    num: "03",
    tag: "SYNTHESIS",
    title: "Calibrated Cards",
    body: "Structured data models providing nuance, subtext, and usage etiquette in a single visual pass.",
  },
];

const examples = [
  "Skibidi",
  "Met Gala",
  "Hanami",
  "Coachella",
  "Bundesliga meme",
];

export function LandingPage() {
  const { user } = useAppState();
  const dashboardHref = resolveDashboardHref(Boolean(user));

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,34,0.72)_0%,rgba(0,10,20,0.28)_42%,rgba(0,10,20,0.92)_100%),radial-gradient(circle_at_50%_-10%,rgba(122,231,255,0.14),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(217,107,43,0.1),transparent_28%)] md:bg-[radial-gradient(circle_at_16%_10%,rgba(217,107,43,0.2),transparent_35%),radial-gradient(circle_at_82%_16%,rgba(98,172,255,0.2),transparent_38%),radial-gradient(circle_at_65%_84%,rgba(24,20,16,0.12),transparent_36%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-12 md:px-10 md:pt-16">
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/logo_2.png"
            alt="CultureLens logo"
            className="h-10 w-10 rounded-lg object-contain"
            width={40}
            height={40}
          />

          <span className="text-2xl font-bold tracking-tight text-foreground">
            CultureLens
          </span>
        </div>

        {/* Hero */}
        <section
          aria-labelledby="hero-heading"
          className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.16em] text-ink-soft">
              AI-Powered Cultural Interpretation
            </p>

            <h1
              id="hero-heading"
              className="max-w-2xl text-4xl font-semibold leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Translate the internet. Catch the vibe instantly.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-ink-soft sm:text-lg">
              CultureLens helps you understand cultural references from
              viral slang to global moments — explaining the origin, meaning,
              cultural impact, and local equivalent in one hit.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={dashboardHref}
                className="btn-primary px-6 py-3 text-sm font-semibold"
              >
                Try now
              </Link>

              <a
                href="https://github.com/nikhilagarwal03/CultureLens"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                aria-label="View CultureLens on GitHub"
              >
                <svg
                  height="20"
                  width="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 12.027l-3.717 2.21.711-4.15-3.02-2.944 4.17-.606L8 2.5l1.856 3.937 4.17.606-3.02 2.944.711 4.15z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Quick prompts */}
          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="CultureLens examples"
            className="rounded-3xl bg-panel p-6 shadow-[0_16px_44px_rgba(24,20,16,0.18)] ring-1 ring-black/10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
              Quick prompts
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {examples.map((item) => (
                <li key={item} className="tag-chip px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-2)_62%,#000),color-mix(in_srgb,var(--accent)_56%,#000))] p-4 text-white">
              <p className="text-sm font-semibold tracking-wide">
                Output format
              </p>

              <p className="mt-2 text-sm/6 text-white/90">
                Reference, cultural impact, origin context, and local analogy
                in one compact card.
              </p>
            </div>
          </motion.aside>
        </section>

        {/* SEO context */}
        <section
          aria-labelledby="about-culturelens"
          className="mt-16 max-w-3xl sm:mt-20"
        >
          <h2
            id="about-culturelens"
            className="text-2xl font-semibold tracking-tight text-white"
          >
            What is CultureLens?
          </h2>

          <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
            CultureLens is an AI-powered cultural analysis tool that explains
            references across songs, movies, memes, slang, internet culture,
            and global events. Instead of simply translating words, it adds
            the cultural context behind them and connects unfamiliar
            references to familiar local equivalents.
          </p>
        </section>

        {/* Feature Grid */}
        <section
          aria-label="CultureLens capabilities"
          className="mt-14 grid grid-cols-1 gap-3 border-t border-[#14263b]/70 pt-8 sm:mt-16 sm:gap-4 md:mt-20 md:grid-cols-3"
        >
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 * i }}
              className="rounded-xl border border-[#14293f] bg-[#071320]/50 p-4 transition hover:border-[#22476d] sm:p-5"
            >
              <div className="flex items-center justify-between font-mono text-[15px] text-[#577b9d]">
                <span className="font-bold text-[#38bdf8]">{p.tag}</span>
                <span>{p.num}</span>
              </div>

              <h3 className="mt-2 text-md font-semibold text-white">
                {p.title}
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-[#7e9bb9]">
                {p.body}
              </p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}