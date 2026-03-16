import type { LLMOutput } from "./llm";

const MAX_ENTRIES = 200;
const TTL_MS = 60 * 60 * 1000; // 1 hour

type CacheEntry = {
  value: LLMOutput;
  expiresAt: number;
};

// Serverless-safe: stored on globalThis so it survives warm restarts
const _g = globalThis as Record<string, unknown>;
const store: Map<string, CacheEntry> =
  _g.__llmCache instanceof Map
    ? (_g.__llmCache as Map<string, CacheEntry>)
    : (() => {
        const m = new Map<string, CacheEntry>();
        _g.__llmCache = m;
        return m;
      })();

function cacheKey(text: string, country?: string, language?: string): string {
  return `${text.toLowerCase()}|${(country ?? "").toLowerCase()}|${(language ?? "en").toLowerCase()}`;
}

export function getCached(
  text: string,
  country?: string,
  language?: string
): LLMOutput | null {
  const key = cacheKey(text, country, language);
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(
  text: string,
  country: string | undefined,
  language: string | undefined,
  value: LLMOutput
): void {
  // Evict oldest entry when at capacity (simple LRU approximation)
  if (store.size >= MAX_ENTRIES) {
    const firstKey = store.keys().next().value;
    if (firstKey !== undefined) store.delete(firstKey);
  }
  store.set(cacheKey(text, country, language), {
    value,
    expiresAt: Date.now() + TTL_MS,
  });
}
