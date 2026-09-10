"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Code2,
  Globe2,
  Mail,
  Sparkles,
} from "lucide-react";

export default function DeveloperPage() {
  const [metrics, setMetrics] = useState<{ searches: number } | null>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="grid auto-rows-[minmax(170px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
        <div className="shell-panel relative overflow-hidden rounded-[24px] p-7 md:col-span-3 md:row-span-2 md:p-10">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-accent/20 bg-accent/10 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between gap-12">
            <div>
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <Code2 className="size-4" /> CultureLens / developer
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-6xl">
                Build a clearer internet.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
                A look behind the tools that turn global references into context people can actually use.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-ink-soft">
              <span className="rounded-full border border-white/10 bg-surface-elevated px-3 py-2">Next.js 16</span>
              <span className="rounded-full border border-white/10 bg-surface-elevated px-3 py-2">OpenRouter</span>
              <span className="rounded-full border border-white/10 bg-surface-elevated px-3 py-2">MongoDB</span>
              <span className="rounded-full border border-white/10 bg-surface-elevated px-3 py-2">Lingo.dev</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-accent p-7 text-[#03121d] md:col-span-1 md:row-span-2">
          <BarChart3 className="size-7" />
          <div className="absolute inset-x-7 bottom-7">
            <div className="text-5xl font-semibold tracking-tight">
              {metrics ? metrics.searches.toLocaleString() : "—"}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] opacity-70">Total searches</div>
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-[#03121d]/15">
              <div className="h-full w-2/3 rounded-full bg-[#03121d]/60" />
            </div>
          </div>
        </div>

        <div className="shell-panel rounded-[24px] p-7 md:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Globe2 className="mb-5 size-6 text-accent" />
              <h2 className="text-2xl font-semibold text-foreground">Context, not just translation.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
                CultureLens combines reference detection, cultural analysis, analogy mapping, and language refinement in one response pipeline.
              </p>
            </div>
            <Sparkles className="hidden size-5 text-accent/70 sm:block" />
          </div>
        </div>

        <a
          href="https://medium.com/@agarwalnikhil909/the-internet-is-global-but-culture-isnt-building-culturelens-016daef78f68"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-surface-muted p-7 transition-transform hover:-translate-y-1 md:col-span-2"
        >
          <div className="flex items-center justify-between text-accent">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Field notes</span>
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <div>
            <h2 className="max-w-md text-2xl font-semibold leading-tight text-foreground">The internet is global, but culture isn&apos;t.</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">Read the story behind the vision, technical journey, and cultural impact.</p>
          </div>
        </a>

        <div className="shell-panel rounded-[24px] p-7 md:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src="https://avatars.githubusercontent.com/u/5633906?v=4" alt="Nikhil Agarwal" className="size-16 rounded-2xl border border-white/15 object-cover" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Nikhil Agarwal</h2>
                <p className="mt-1 text-sm text-ink-soft">Creator &amp; maintainer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="https://github.com/nikhilagarwal03" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="btn-ghost size-10" title="GitHub"><Code2 className="size-4" /></a>
              <a href="https://www.linkedin.com/in/nikhilagaarwal" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn-ghost size-10" title="LinkedIn"><Globe2 className="size-4" /></a>
              <a href="mailto:agarwalnikhil909@gmail.com" aria-label="Email" className="btn-ghost size-10" title="Email"><Mail className="size-4" /></a>
            </div>
          </div>
          <a href="https://github.com/nikhilagarwal03/CultureLens" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-foreground">
            Explore the source <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="flex items-end rounded-[24px] border border-accent/15 bg-accent/10 p-7 md:col-span-2">
          <p className="max-w-md text-sm leading-6 text-ink-soft">Made with curiosity in India, for anyone trying to understand what the internet means somewhere else.</p>
        </div>
      </section>
    </main>
  );
}
