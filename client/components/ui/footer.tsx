"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppState } from "@/components/providers/app-provider";
import { isDashboardRouteActive, resolveDashboardHref } from "@/lib/client/navigation";

export function Footer() {
  const pathname = usePathname();
  const { user } = useAppState();
  const [metrics, setMetrics] = useState<{ searches: number } | null>(null);
  const dashboardHref = resolveDashboardHref(Boolean(user));

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <footer className="mt-auto border-t border-white/8 bg-[color-mix(in_srgb,var(--panel)_88%,transparent)] px-6 py-8 text-sm text-ink-soft backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo_2.png" alt="CultureLens logo" className="h-8 w-8 rounded-lg object-contain" />
            <div>
              <p className="text-base font-semibold text-foreground">CultureLens</p>
              <p className="text-xs tracking-[0.14em] uppercase">Cross-cultural clarity for the internet age</p>
            </div>
          </div>
          <p className="mt-3 max-w-xl leading-6">
            Decode trends, memes, and cultural moments through origin, impact, and a local analogy that actually makes sense to you.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex w-full flex-wrap items-center gap-3 justify-end">
            {metrics && (
              <div className="rounded-lg bg-black/5 px-3 py-1 text-xs text-ink-soft/80 font-medium w-fit order-1 md:order-none">
                Searches: {metrics.searches.toLocaleString()}
              </div>
            )}
            <nav className="flex flex-wrap items-center gap-3 order-2" aria-label="Footer navigation">
              <Link href="/" className={`btn-ghost px-3 py-2 text-sm ${pathname === "/" ? "opacity-100" : "opacity-80"}`}>
                Home
              </Link>
              <Link href={dashboardHref} className={`btn-ghost px-3 py-2 text-sm ${isDashboardRouteActive(pathname, dashboardHref) ? "opacity-100" : "opacity-80"}`}>
                Dashboard
              </Link>
              <Link href="/profile" className={`btn-ghost px-3 py-2 text-sm ${pathname === "/profile" ? "opacity-100" : "opacity-80"}`}>
                Profile
              </Link>
              <Link href="/developer" className={`btn-ghost px-3 py-2 text-sm ${pathname === "/developer" ? "opacity-100" : "opacity-80"}`}>
                Developer
              </Link>
            </nav>
          </div>
          <p className="text-xs">Built to attract curiosity, reduce confusion, and make cross-cultural context feel effortless.</p>
        </div>
      </div>
    </footer>
  );
}
