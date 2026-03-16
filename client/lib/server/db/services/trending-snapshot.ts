import { getTrendingReferences, type TrendingReference } from "./search-history";

type TrendingSnapshot = {
  items: TrendingReference[];
  refreshedAt: number;
  nextRefreshAt: number;
};

type TrendingSnapshotResult = {
  items: TrendingReference[];
  refreshedAt: string;
  nextRefreshAt: string;
  source: "cache" | "refresh";
};

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

declare global {
  var __cultureLensTrendingSnapshot: TrendingSnapshot | undefined;
}

function readSnapshot(): TrendingSnapshot | null {
  return globalThis.__cultureLensTrendingSnapshot ?? null;
}

function writeSnapshot(items: TrendingReference[]): TrendingSnapshot {
  const refreshedAt = Date.now();
  const snapshot: TrendingSnapshot = {
    items,
    refreshedAt,
    nextRefreshAt: refreshedAt + REFRESH_INTERVAL_MS,
  };
  globalThis.__cultureLensTrendingSnapshot = snapshot;
  return snapshot;
}

export async function getAutoUpdatedTrendingSnapshot(options?: {
  limit?: number;
  sinceDays?: number;
}): Promise<TrendingSnapshotResult> {
  const existing = readSnapshot();
  const now = Date.now();

  if (existing && now < existing.nextRefreshAt) {
    return {
      items: existing.items,
      refreshedAt: new Date(existing.refreshedAt).toISOString(),
      nextRefreshAt: new Date(existing.nextRefreshAt).toISOString(),
      source: "cache",
    };
  }

  const items = await getTrendingReferences(options);
  const snapshot = writeSnapshot(items);

  return {
    items: snapshot.items,
    refreshedAt: new Date(snapshot.refreshedAt).toISOString(),
    nextRefreshAt: new Date(snapshot.nextRefreshAt).toISOString(),
    source: "refresh",
  };
}

export function getTrendingRefreshIntervalMs(): number {
  return REFRESH_INTERVAL_MS;
}
