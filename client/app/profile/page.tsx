"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppState } from "@/components/providers/app-provider";
import { useToast } from "@/components/ui/toast";
import { LanguageSelector } from "@/components/ui/language-selector";
import { CountrySelector } from "@/components/ui/country-selector";
import {
  readFavoriteExplains,
  readRecentExplains,
  toggleFavoriteExplain,
  type FavoriteExplainEntry,
  type RecentExplainEntry,
} from "@/lib/client/explain-storage";

type HistoryItem = RecentExplainEntry;
type FavoriteItem = FavoriteExplainEntry;


function fmt(dateValue: string): string {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isHydrated, updateUser, clearUserProfile } = useAppState();
  const toast = useToast();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      setLoading(false);
      return;
    }

    setCountry(user.country || "");
    setLanguage(user.preferredLanguage || "en");
    setHistory(readRecentExplains());
    setFavorites(readFavoriteExplains());
    setLoading(false);
  }, [isHydrated, user]);

  async function savePreferences() {
    if (!user) return;

    setSaving(true);
    try {
      updateUser({ preferredLanguage: language, country });
      toast({ message: "Preferences updated!", type: "success" });
    } finally {
      setSaving(false);
    }
  }

  function resetProfile() {
    clearUserProfile();
    router.push("/");
  }

  function removeFavorite(item: FavoriteItem) {
    toggleFavoriteExplain({
      query: item.query,
      createdAt: item.savedAt,
      result: {
        reference: item.reference,
        originCulture: item.originCulture,
        localAnalogy: item.localAnalogy,
        culturalImpact: "",
        context: "",
      },
    });
    setFavorites(readFavoriteExplains());
    toast({ message: "Bookmark removed.", type: "success" });
  }

  if (!isHydrated || loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-8">
        <div className="h-10 w-48 animate-pulse rounded bg-black/10" />
        <div className="mt-4 h-28 animate-pulse rounded-2xl bg-black/10" />
        <div className="mt-4 h-28 animate-pulse rounded-2xl bg-black/10" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">No profile saved</h1>
        <p className="mt-3 text-ink-soft">Add your local profile details first to personalize language and country preferences.</p>
        <Link href="/onboarding" className="btn-primary mt-6 px-6 py-2.5 text-sm font-semibold">
          Open Onboarding
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Profile</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Account and preferences</h1>
      </motion.header>
      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="shell-panel rounded-[24px] p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Local profile</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="text-ink-soft">Name:</span> {user.name || "-"}</p>
            <p><span className="text-ink-soft">Mode:</span> Local-only personalization</p>
            <p><span className="text-ink-soft">Country:</span> {user.country || "-"}</p>
            <p><span className="text-ink-soft">Language:</span> {user.preferredLanguage || "en"}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Preferred language</label>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Country</label>
              <CountrySelector value={country} onChange={setCountry} />
            </div>

            <button
              onClick={() => void savePreferences()}
              disabled={saving}
              className="btn-primary px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </article>

        <article className="shell-panel rounded-[24px] p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Search history</h2>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">No history yet. Try a few cultural searches first.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {history.map((item) => (
                <li key={item.id} className="surface-input rounded-[18px] p-3 ring-1">
                  <p className="line-clamp-2 text-sm font-medium">{item.query}</p>
                  <p className="mt-1 text-xs text-ink-soft">{item.reference}</p>
                  <p className="mt-1 text-[11px] text-ink-soft/85">{fmt(item.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="shell-panel mt-5 rounded-[24px] p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight">Bookmarks</h2>
        {favorites.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">No bookmarks yet. Save results from the result page.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {favorites.map((item) => (
              <li key={item.id} className="surface-input rounded-[18px] p-3 ring-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="line-clamp-2 text-sm font-medium">{item.query}</p>
                    <p className="mt-1 text-xs text-ink-soft">{item.reference}</p>
                    <p className="mt-1 text-[11px] text-ink-soft/85">{fmt(item.savedAt)}</p>
                  </div>
                  <button
                    onClick={() => removeFavorite(item)}
                    className="btn-ghost px-3 py-1 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="shell-panel mt-5 rounded-[24px] p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight">Profile settings</h2>
        <p className="mt-2 text-sm text-ink-soft">
          This device stores your profile locally. You can reset it at any time.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={resetProfile}
            className="btn-danger px-4 py-2 text-sm font-semibold"
          >
            Reset profile
          </button>
          <Link href="/app" className="btn-secondary px-4 py-2 text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
