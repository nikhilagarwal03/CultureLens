import { NextRequest, NextResponse } from "next/server";
import { incrementVisits } from "@/lib/server/db/services/metrics";

export async function middleware(req: NextRequest) {
  // Only increment for root page loads (not API, static, etc.)
  if (req.nextUrl.pathname === "/") {
    await incrementVisits();
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
