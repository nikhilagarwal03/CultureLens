

import { NextRequest, NextResponse } from "next/server";
import {
  incrementVisits,
  shouldCountVisitByKey,
} from "@/lib/server/db/services/metrics";

const VISIT_SESSION_COOKIE = "visit_session_started_at";
const VISIT_SESSION_TTL_SECONDS = 30 * 60;

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function hashVisitorFingerprint(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }

  return (hash >>> 0).toString(36);
}


export async function middleware(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.next();
  }

  // Skip Next.js prefetch requests to avoid inflated counts.
  const isPrefetch =
    req.headers.get("purpose") === "prefetch" || req.headers.has("next-router-prefetch");
  if (isPrefetch) {
    return NextResponse.next();
  }

  // Count only actual document navigations.
  const fetchDest = req.headers.get("sec-fetch-dest");
  if (fetchDest && fetchDest !== "document") {
    return NextResponse.next();
  }

  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/html")) {
    return NextResponse.next();
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const rawSessionStartedAt = req.cookies.get(VISIT_SESSION_COOKIE)?.value;
  const sessionStartedAt = Number.parseInt(rawSessionStartedAt ?? "", 10);
  const hasActiveVisitSession =
    Number.isFinite(sessionStartedAt) &&
    nowInSeconds - sessionStartedAt < VISIT_SESSION_TTL_SECONDS;

  const res = NextResponse.next();

  // Keep session alive while user is active; only count when starting a new session.
  res.cookies.set(VISIT_SESSION_COOKIE, String(nowInSeconds), {
    maxAge: VISIT_SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // Visibility for manual verification in browser Network tab.
  res.headers.set("x-visit-session", hasActiveVisitSession ? "existing" : "new");

  if (hasActiveVisitSession) {
    return res;
  }

  let shouldIncrement = true;
  let visitSessionSource = "cookie-new";

  // Cookie-disabled browsers fall back to short-lived server dedupe.
  if (!rawSessionStartedAt) {
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";
    const dedupeBucket = Math.floor(nowInSeconds / VISIT_SESSION_TTL_SECONDS);
    const dedupeKey = `${hashVisitorFingerprint(`${clientIp}|${userAgent}`)}:${dedupeBucket}`;

    try {
      shouldIncrement = await shouldCountVisitByKey(dedupeKey, VISIT_SESSION_TTL_SECONDS);
      visitSessionSource = shouldIncrement ? "fallback-new" : "fallback-existing";
    } catch (error) {
      // Degrade gracefully: if dedupe storage fails, don't block user traffic.
      console.error("Failed to evaluate visit dedupe key", error);
      shouldIncrement = true;
      visitSessionSource = "fallback-error";
    }
  }

  res.headers.set("x-visit-session", visitSessionSource);

  if (!shouldIncrement) {
    return res;
  }

  try {
    await incrementVisits();
  } catch (error) {
    // Never block page delivery if metrics write fails.
    console.error("Failed to increment visits", error);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
