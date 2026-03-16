import { NextRequest } from "next/server";
import { getMetrics } from "@/lib/server/db/services/metrics";

export async function GET(req: NextRequest) {
  const metrics = await getMetrics();
  return new Response(JSON.stringify(metrics), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
