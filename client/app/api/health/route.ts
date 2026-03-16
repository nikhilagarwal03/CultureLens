import { withApiHandler } from "@/lib/server/api/handler";
import { successResponse } from "@/lib/server/api/response";
import { getPhase1ConfigStatus } from "@/lib/server/env";
import { getStartupWarnings } from "@/lib/server/startup";

export const GET = withApiHandler(
  async (_request, context) => {
    const config = getPhase1ConfigStatus();

    return successResponse(
      {
        message: "CultureLens API Running",
        status: "ok",
        timestamp: new Date().toISOString(),
        setup: {
          phase1Configured: config.configured,
          llmProvider: config.llmProvider,
          warnings: getStartupWarnings(),
        },
      },
      200,
      { requestId: context.requestId }
    );
  },
  {
    routeName: "health",
    enableLogging: true,
    maxRequestsPerMinute: 120,
  }
);
