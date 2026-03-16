"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ExplainLoading } from "@/components/ui/explain-loading";
import { apiClient, ApiClientError } from "@/lib/client/api";
import { useAppState } from "@/components/providers/app-provider";
import {
  appendRecentExplain,
  readRecentExplains,
  saveLastExplain,
  removeRecentExplain,
  clearRecentExplains,
  type RecentExplainEntry,
} from "@/lib/client/explain-storage";
import { searchCultureReference } from "@/lib/client/search";
import { SearchBar } from "@/components/ui/search-bar";
import { QuickSearchButtons } from "@/components/ui/quick-search-buttons";

type HistoryItem = RecentExplainEntry;

type TrendingResponse = {
  items: Array<{
    reference: string;
    count: number;
    latestAt: string;
  }>;
  windowDays: number;
};

const QUICK_PROMPTS = [
  "Why is the Super Bowl such a big deal in the US?",
  "What does 'based' mean online?",
  "Why are Roman Empire memes trending?",
  "What does senpai mean in anime culture?",
  "What is Met Gala and why does everyone talk about it?",
];

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppDashboardPage() {
  const router = useRouter();
  // Destructured onboardingComplete from AppProvider
  const { user, isHydrated, onboardingComplete } = useAppState();

  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trending, setTrending] = useState<string[]>([]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      setHistory([]);
      setHistory(readRecentExplains());
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // UPDATED GUARD: Only redirect if onboarding is NOT complete 
    // AND we don't have basic user info.
    if (!onboardingComplete && !user?.name) {
      router.replace("/onboarding");
      return;
    }

    void loadHistory();

    void (async () => {
      try {
        const response = await apiClient.get<TrendingResponse>("/api/trending");
        setTrending(response.items.map((item) => item.reference).slice(0, 6));
      } catch {
        setTrending([]);
      }
    })();
  }, [isHydrated, user, onboardingComplete, loadHistory, router]);

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  async function runExplain(event?: FormEvent) {
    event?.preventDefault();
    if (!trimmedQuery || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const data = await searchCultureReference({
        text: trimmedQuery,
        userCountry: user?.country,
        // The backend now handles language detection automatically
        userLanguage: user?.preferredLanguage,
      });

      saveLastExplain({
        query: trimmedQuery,
        createdAt: new Date().toISOString(),
        result: data,
      });
      appendRecentExplain({
        query: trimmedQuery,
        createdAt: new Date().toISOString(),
        result: data,
      });

      await loadHistory();

      router.push("/app/result");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Could not generate explanation right now. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function applyPrompt(prompt: string) {
    setQuery(prompt);
    setError(null);
  }

  return (
    <>
      {isLoading && <ExplainLoading />}
      <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_340px]">
        <section className="shell-panel rounded-[24px] p-5 sm:p-7">
          <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>

          <div className="mt-7">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={runExplain}
              isLoading={isLoading}
              placeholder="Ask any cultural reference and get origin context plus a local analogy tailored for you."
            />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">Quick prompts</p>
            <QuickSearchButtons prompts={QUICK_PROMPTS} onSelect={applyPrompt} />
          </div>

          {trending.length > 0 ? (
            <section className="mt-8 mb-2 border-t border-black/10 pt-6">
              <h3 className="mb-3 text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">Trending References</h3>
              <QuickSearchButtons prompts={trending} onSelect={applyPrompt} />
            </section>
          ) : null}

          {error ? <p className="status-error mt-5 rounded-lg px-3 py-2 text-sm">{error}</p> : null}

          <p className="mt-5 text-sm text-ink-soft">
            Result opens on a dedicated page with copy, share, and download actions.
          </p>
        </section>

        <aside className="shell-panel rounded-[24px] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent history</h2>
            <div className="flex gap-2">
              <button
                onClick={() => void loadHistory()}
                className="btn-secondary px-3 py-1 text-xs font-medium"
              >
                Refresh
              </button>
              <button
                onClick={() => { clearRecentExplains(); setHistory([]); }}
                className="btn-secondary px-3 py-1 text-xs font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          {historyLoading ? (
            <div className="mt-4 space-y-2">
              <div className="h-14 animate-pulse rounded-xl bg-black/10" />
              <div className="h-14 animate-pulse rounded-xl bg-black/10" />
              <div className="h-14 animate-pulse rounded-xl bg-black/10" />
            </div>
          ) : null}

          {!historyLoading && history.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">No searches yet. Your first explanation will appear here.</p>
          ) : null}

          {!historyLoading && history.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {history.map((item) => (
                <li key={item.id} className="relative surface-input rounded-[18px] p-3 ring-1">
                  <button
                    onClick={() => {
                      removeRecentExplain(item.id);
                      setHistory(readRecentExplains());
                    }}
                    className="absolute right-2 top-2 z-10 rounded-full p-1 text-ink-soft hover:bg-black/10 focus:outline-none"
                    aria-label="Remove from history"
                  >
                    &#10005;
                  </button>
                  <p className="line-clamp-2 text-sm font-medium">{item.query}</p>
                  <p className="mt-1 text-xs text-ink-soft">{item.reference}</p>
                  <p className="mt-1 text-[11px] text-ink-soft/80">{formatDateTime(item.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </main>
    </>
  );
}