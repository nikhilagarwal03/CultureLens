"use client";
import { useEffect, useState } from "react";

export default function DeveloperPage() {
  const [metrics, setMetrics] = useState<{ searches: number } | null>(null);

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
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow">Developer Space</h1>
          </div>
        </div>
        <p className="mb-8 text-base text-ink-soft max-w-2xl">
          Welcome to the CultureLens developer space! Here you can find live site metrics, API inspiration, and a peek behind the scenes. Stay curious, build cool things, and help make the internet more culturally aware.
        </p>
        {metrics && (
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex-1 min-w-[180px] max-w-[260px] rounded-2xl bg-surface-elevated p-6 shadow-lg text-accent border border-panel">
              <div className="text-3xl font-bold mb-1 text-foreground">{metrics.searches.toLocaleString()}</div>
              <div className="text-xs uppercase tracking-widest opacity-80 text-ink-soft">Searches</div>
            </div>
          </div>
        )}
        {/* Medium Blog Post Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-2 text-foreground flex items-center gap-2">
            <svg height="22" viewBox="0 0 24 24" fill="currentColor" className="inline-block text-accent"><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15ZM7.5 7A1.5 1.5 0 1 0 7.5 10A1.5 1.5 0 0 0 7.5 7ZM6 12c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-4Zm2 0v4h8v-4H8Zm7.5-5A1.5 1.5 0 1 0 16.5 10A1.5 1.5 0 0 0 15.5 7Z"/></svg>
            Medium Blog Post
          </h2>
          <p className="mb-3 text-ink-soft">Read the story behind CultureLens, including the vision, technical journey, and cultural impact:</p>
          <div className="flex-1 min-w-[180px] max-w-[700px] rounded-2xl bg-surface-elevated p-6 shadow-lg text-accent border border-panel">
          <a
            href="https://medium.com/@agarwalnikhil909/the-internet-is-global-but-culture-isnt-building-culturelens-016daef78f68"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase tracking-widest opacity-80 text hover:text-foreground transition font-medium"
            >
            The Internet is Global, but Culture Isn’t: Building CultureLens
          </a>
          </div>
        </div>
        {/* Author details and GitHub link */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://avatars.githubusercontent.com/u/5633906?v=4"
              alt="Nikhil Agarwal GitHub Avatar"
              className="w-16 h-16 rounded-full border-2 border-panel shadow-lg mb-1"
            />
            <div className="text-center">
              <div className="font-semibold text-xl text-foreground">Nikhil Agarwal</div>
              <div className="text-xs text-ink-soft">Creator & Maintainer</div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 mt-2">
            {/* GitHub */}
            <a
              href="https://github.com/nikhilagarwal03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm font-medium shadow"
              title="GitHub"
            >
              <svg height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="inline-block">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/nikhilagaarwal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition text-sm font-medium shadow"
              title="LinkedIn"
            >
              <svg height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="inline-block">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" />
              </svg>
              LinkedIn
            </a>
            {/* Email */}
            <a
              href="mailto:agarwalnikhil909@gmail.com"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-600 transition text-sm font-medium shadow"
              title="Email"
            >
              <svg height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="inline-block">
                <path d="M12 13.065l-11.99-8.065h23.98l-11.99 8.065zm-12-7.065v14h24v-14l-12 8.065-12-8.065z" />
              </svg>
              Email
            </a>
          </div>
          <a
            href="https://github.com/nikhilagarwal03/CultureLens"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition text-sm font-medium shadow border border-gray-700"
          >
            <svg height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="inline-block">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Star the Project
          </a>
        </div>
        <div className="mt-12 text-center text-xs text-ink-soft/70">
          <span className="inline-block px-3 py-1 rounded-full bg-surface-muted/60 backdrop-blur">Made with 💙 in INDIA</span>
        </div>
      </section>
    </main>
  );
}
