import { ApiError } from "@/lib/server/api/errors";

type RateEntry = {
  count: number;
  resetAt: number;
};

declare global {
  var __cultureLensRateLimitStore: Map<string, RateEntry> | undefined;
}

function getStore(): Map<string, RateEntry> {
  if (!globalThis.__cultureLensRateLimitStore) {
    globalThis.__cultureLensRateLimitStore = new Map<string, RateEntry>();
  }
  return globalThis.__cultureLensRateLimitStore;
}

function now(): number {
  return Date.now();
}

function asPositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function shouldBypassRateLimitInDev(): boolean {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) return false;
  // Default behavior: keep local dev/test ergonomics smooth unless explicitly disabled.
  return process.env.API_RATE_LIMIT_DISABLE_IN_DEV !== "false";
}

function getClientKey(request: Request): string {
  const directIpHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
  ];

  for (const header of directIpHeaders) {
    const value = request.headers.get(header);
    if (value) {
      return value.split(",")[0]?.trim() || "unknown";
    }
  }

  const userAgent = request.headers.get("user-agent")?.trim();
  if (userAgent) {
    return `ua:${userAgent.slice(0, 120)}`;
  }

  return "unknown";
}

export function enforceRateLimit(params: {
  request: Request;
  routeName: string;
  maxRequestsPerMinute?: number;
}): void {
  if (shouldBypassRateLimitInDev()) {
    return;
  }

  const defaultRate = asPositiveInt(process.env.API_RATE_LIMIT_PER_MINUTE) ?? 60;
  const maxRequestsPerMinute = params.maxRequestsPerMinute ?? defaultRate;
  const key = `${params.routeName}:${getClientKey(params.request)}`;
  const store = getStore();
  const current = store.get(key);
  const currentTime = now();

  if (!current || current.resetAt <= currentTime) {
    store.set(key, {
      count: 1,
      resetAt: currentTime + 60_000,
    });
    return;
  }

  if (current.count >= maxRequestsPerMinute) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - currentTime) / 1000));
    throw new ApiError(
      429,
      "RATE_LIMITED",
      "Too many requests. Please try again shortly.",
      {
        retryAfterSeconds,
        resetAt: new Date(current.resetAt).toISOString(),
      }
    );
  }

  current.count += 1;
  store.set(key, current);
}
