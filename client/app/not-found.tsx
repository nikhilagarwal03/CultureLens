import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center px-6 py-12 sm:px-8">
      <section className="shell-panel grid w-full gap-8 rounded-[28px] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-xs tracking-[0.18em] text-ink-soft uppercase">404 · Route not found</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            This page slipped outside the cultural map.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
            The link may be outdated, the route may have moved, or the page was never part of this build. Use one of the main paths below to get back on track.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary px-5 py-3 text-sm font-semibold">
              Go Home
            </Link>
            <Link href="/app" className="btn-secondary px-5 py-3 text-sm font-semibold">
              Open Dashboard
            </Link>
            <Link href="/onboarding" className="btn-ghost px-5 py-3 text-sm font-semibold">
              Continue as Guest
            </Link>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-elevated)_88%,transparent),color-mix(in_srgb,var(--surface-muted)_92%,transparent))] p-6">
          <div className="brand-mark">CL</div>
          <p className="mt-5 text-sm font-semibold text-foreground">Recommended routes</p>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="surface-input rounded-[16px] px-4 py-3 ring-1">/</li>
            <li className="surface-input rounded-[16px] px-4 py-3 ring-1">/app</li>
            <li className="surface-input rounded-[16px] px-4 py-3 ring-1">/profile</li>
            <li className="surface-input rounded-[16px] px-4 py-3 ring-1">/onboarding</li>
          </ul>
        </div>
      </section>
    </main>
  );
}