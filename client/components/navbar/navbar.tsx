"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/components/providers/app-provider";

export function Navbar() {
  const pathname = usePathname();
  const { user, onboardingComplete } = useAppState();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/8 bg-[color-mix(in_srgb,var(--panel)_86%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <img src="/logo_2.png" alt="CultureLens logo" className="h-8 w-8 rounded-lg object-contain" />
          <span>
            <span className="block text-sm font-semibold tracking-tight">CultureLens</span>
            <span className="block text-[11px] tracking-[0.14em] text-ink-soft uppercase">Global context, locally understood</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink href="/" current={pathname === "/"}>Home</NavLink>
          
          {/* Dashboard and Profile are now always accessible once onboarding is finished */}
          <NavLink href="/app" current={pathname.startsWith("/app")}>Dashboard</NavLink>
          <NavLink href="/profile" current={pathname === "/profile"}>Profile</NavLink>
          
          <NavLink href="/developer" current={pathname === "/developer"}>Developer</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user?.name ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-ink-soft lg:inline">
                {user.name}
              </span>
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                {user.name[0].toUpperCase()}
              </div>
            </div>
          ) : onboardingComplete ? (
            <Link href="/profile" className="btn-secondary py-1.5 px-3 text-xs">
              Set up Profile
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-[12px] px-4 py-2 text-sm font-medium transition ${
        current
          ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[color-mix(in_srgb,var(--accent)_82%,white_18%)]"
          : "text-foreground hover:bg-white/6"
      }`}
    >
      {children}
    </Link>
  );
}