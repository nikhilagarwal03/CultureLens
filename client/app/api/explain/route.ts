import { withApiHandler } from "@/lib/server/api/handler";
import { successResponse } from "@/lib/server/api/response";
import {
  optionalString,
  parseJsonBody,
  requireNonEmptyString,
} from "@/lib/server/api/validation";
import { explainCulture } from "@/lib/server/explain";
import { persistSearchHistory } from "@/lib/server/db/services/search-history";
import { incrementSearches } from "@/lib/server/db/services/metrics";

type ExplainRequestBody = {
  text?: string;
  userCountry?: string;
  userLanguage?: string;
};

export const POST = withApiHandler(
  async (request, context) => {
    const body = await parseJsonBody<ExplainRequestBody>(request);
    const text = requireNonEmptyString(body.text, "text");
    const userCountry = optionalString(body.userCountry);
    const userLanguage = optionalString(body.userLanguage);

    const result = await explainCulture({
      text,
      userCountry,
      userLanguage,
    });

    // Increment searches metric
    await incrementSearches();

    const saved = await persistSearchHistory({
      queryText: text,
      userCountry,
      userLanguage,
      result,
    });

    return successResponse(
      {
        ...result,
        historyId: saved?.id,
      },
      200,
      { requestId: context.requestId }
    );
  },
  {
    routeName: "explain",
    enableLogging: true,
    maxRequestsPerMinute: 45,
  }
);
