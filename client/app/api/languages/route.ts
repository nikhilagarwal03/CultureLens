import { withApiHandler } from "@/lib/server/api/handler";
import { successResponse } from "@/lib/server/api/response";
import { SUPPORTED_LANGUAGE_CODES } from "@/lib/server/localization/supported-languages";

export const GET = withApiHandler(
  async (_request, context) => {
    return successResponse(
      {
        supportedLanguages: SUPPORTED_LANGUAGE_CODES,
        defaultLanguage: "en",
      },
      200,
      { requestId: context.requestId }
    );
  },
  {
    routeName: "languages",
    enableLogging: false,
    maxRequestsPerMinute: 120,
  }
);
