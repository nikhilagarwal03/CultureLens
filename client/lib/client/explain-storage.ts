export type ExplainResult = {
  reference: string;
  originCulture: string;
  culturalImpact: string;
  localAnalogy: string;
  context: string;
  historyId?: string;
};

export type StoredExplainPayload = {
  query: string;
  createdAt: string;
  result: ExplainResult;
};

export type RecentExplainEntry = {
  id: string;
  query: string;
  reference: string;
  originCulture: string;
  localAnalogy: string;
  createdAt: string;
};

export type FavoriteExplainEntry = {
  id: string;
  query: string;
  reference: string;
  originCulture: string;
  localAnalogy: string;
  savedAt: string;
};

export const LAST_EXPLAIN_KEY = "culturelens.last-explain.v1";
export const RECENT_EXPLAINS_KEY = "culturelens.recent-explains.v1";
export const FAVORITE_EXPLAINS_KEY = "culturelens.favorite-explains.v1";

export function saveLastExplain(payload: StoredExplainPayload): void {
  window.localStorage.setItem(LAST_EXPLAIN_KEY, JSON.stringify(payload));
}

export function readLastExplain(): StoredExplainPayload | null {
  try {
    const raw = window.localStorage.getItem(LAST_EXPLAIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredExplainPayload;
  } catch {
    window.localStorage.removeItem(LAST_EXPLAIN_KEY);
    return null;
  }
}

export function appendRecentExplain(payload: StoredExplainPayload): void {
  const entry: RecentExplainEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    query: payload.query,
    reference: payload.result.reference,
    originCulture: payload.result.originCulture,
    localAnalogy: payload.result.localAnalogy,
    createdAt: payload.createdAt,
  };

  const next = [entry, ...readRecentExplains()].slice(0, 20);
  window.localStorage.setItem(RECENT_EXPLAINS_KEY, JSON.stringify(next));
}

export function readRecentExplains(): RecentExplainEntry[] {
  try {
    const raw = window.localStorage.getItem(RECENT_EXPLAINS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentExplainEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(RECENT_EXPLAINS_KEY);
    return [];
  }
}

export function readFavoriteExplains(): FavoriteExplainEntry[] {
  try {
    const raw = window.localStorage.getItem(FAVORITE_EXPLAINS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteExplainEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(FAVORITE_EXPLAINS_KEY);
    return [];
  }
}

export function isFavoriteExplain(query: string, reference: string): boolean {
  return readFavoriteExplains().some(
    (item) => item.query === query && item.reference === reference
  );
}

export function toggleFavoriteExplain(payload: StoredExplainPayload): boolean {
  const current = readFavoriteExplains();
  const existingIndex = current.findIndex(
    (item) => item.query === payload.query && item.reference === payload.result.reference
  );

  if (existingIndex >= 0) {
    const next = [...current.slice(0, existingIndex), ...current.slice(existingIndex + 1)];
    window.localStorage.setItem(FAVORITE_EXPLAINS_KEY, JSON.stringify(next));
    return false;
  }

  const entry: FavoriteExplainEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    query: payload.query,
    reference: payload.result.reference,
    originCulture: payload.result.originCulture,
    localAnalogy: payload.result.localAnalogy,
    savedAt: payload.createdAt,
  };

  const next = [entry, ...current].slice(0, 50);
  window.localStorage.setItem(FAVORITE_EXPLAINS_KEY, JSON.stringify(next));
  return true;
}

// Remove a single recent explain by id
export function removeRecentExplain(id: string): void {
  const current = readRecentExplains();
  const next = current.filter((item) => item.id !== id);
  window.localStorage.setItem(RECENT_EXPLAINS_KEY, JSON.stringify(next));
}

// Clear all recent explains
export function clearRecentExplains(): void {
  window.localStorage.removeItem(RECENT_EXPLAINS_KEY);
}
