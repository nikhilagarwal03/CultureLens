"use client";
import { useEffect, useState } from "react";

export default function DeveloperPage() {
  const [metrics, setMetrics] = useState<{ visits: number; searches: number } | null>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <main className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-6 py-10 sm:px-8 overflow-hidden">
      {/* Subtle panel background using theme colors */}
      <section className="relative z-10 shell-panel w-full rounded-[24px] p-10 shadow-2xl bg-panel border border-black/10">
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated text-accent text-3xl shadow-lg">
            &#128187;
          </span>
          <div>
            <p className="text-xs tracking-[0.16em] text-ink-soft uppercase">Developer</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow">Developer Space</h1>
          </div>
        </div>
        <p className="mb-8 text-base text-ink-soft max-w-2xl">
          Welcome to the CultureLens developer space! Here you can find live site metrics, API inspiration, and a peek behind the scenes. Stay curious, build cool things, and help make the internet more culturally aware.
        </p>
        {metrics && (
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex-1 min-w-[180px] max-w-[260px] rounded-2xl bg-surface-elevated p-6 shadow-lg text-accent border border-panel">
              <div className="text-3xl font-bold mb-1 text-foreground">{metrics.visits.toLocaleString()}</div>
              <div className="text-xs uppercase tracking-widest opacity-80 text-ink-soft">Visits</div>
            </div>
            <div className="flex-1 min-w-[180px] max-w-[260px] rounded-2xl bg-surface-elevated p-6 shadow-lg text-accent border border-panel">
              <div className="text-3xl font-bold mb-1 text-foreground">{metrics.searches.toLocaleString()}</div>
              <div className="text-xs uppercase tracking-widest opacity-80 text-ink-soft">Searches</div>
            </div>
          </div>
        )}
        {/* Author details and GitHub link */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <img
              src="https://avatars.githubusercontent.com/u/5633906?v=4"
              alt="Nikhil Agarwal GitHub Avatar"
              className="w-12 h-12 rounded-full border border-panel shadow"
            />
            <div className="text-left">
              <div className="font-semibold text-lg text-foreground">Nikhil Agarwal</div>
              <div className="text-xs text-ink-soft">Creator & Maintainer</div>
            </div>
          </div>
          <a
            href="https://github.com/nikhilagarwal03/CultureLens"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm font-medium shadow"
          >
            <svg height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="inline-block">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Star on GitHub
          </a>
        </div>
        <div className="mt-12 text-center text-xs text-ink-soft/70">
          <span className="inline-block px-3 py-1 rounded-full bg-surface-muted/60 backdrop-blur">Made with 💡 by CultureLens</span>
        </div>
      </section>
    </main>
  );
}
