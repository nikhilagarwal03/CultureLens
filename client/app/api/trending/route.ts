import { withApiHandler } from "@/lib/server/api/handler";
import { successResponse } from "@/lib/server/api/response";
import {
  getAutoUpdatedTrendingSnapshot,
  getTrendingRefreshIntervalMs,
} from "@/lib/server/db/services/trending-snapshot";

export const GET = withApiHandler(
  async (_request, context) => {
    const snapshot = await getAutoUpdatedTrendingSnapshot({
      limit: 10,
      sinceDays: 14,
    });

    return successResponse(
      {
        items: snapshot.items,
        windowDays: 14,
        source: snapshot.source,
        refreshedAt: snapshot.refreshedAt,
        nextRefreshAt: snapshot.nextRefreshAt,
        refreshIntervalMs: getTrendingRefreshIntervalMs(),
      },
      200,
      { requestId: context.requestId }
    );
  },
  {
    routeName: "trending",
    enableLogging: true,
    maxRequestsPerMinute: 120,
  }
);
