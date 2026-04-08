

import { NextRequest, NextResponse } from "next/server";
import { incrementVisits } from "@/lib/server/db/services/metrics";


export async function middleware(req: NextRequest) {
  // Only increment for root page loads (not API, static, etc.)
  if (req.nextUrl.pathname === "/") {
    const cookieName = "visited";
    const cookie = req.cookies.get(cookieName);
    if (!cookie) {
      await incrementVisits();
      const res = NextResponse.next();
      // Set cookie for 24 hours
      res.cookies.set(cookieName, "1", {
        maxAge: 60 * 60 * 24, // 24 hours in seconds
        path: "/",
        sameSite: "lax",
      });
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
