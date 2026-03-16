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
        <div className="mt-12 text-center text-xs text-ink-soft/70">
          <span className="inline-block px-3 py-1 rounded-full bg-surface-muted/60 backdrop-blur">Made with 💡 by CultureLens</span>
        </div>
      </section>
    </main>
  );
}
