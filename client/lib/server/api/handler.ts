import { normalizeError } from "@/lib/server/api/errors";
import { errorResponse } from "@/lib/server/api/response";
import { enforceRateLimit } from "@/lib/server/utils/rate-limit";
import { logApiError, logApiRequest } from "@/lib/server/utils/logger";

type ApiContext = {
  requestId: string;
};

type ApiHandler = (request: Request, context: ApiContext) => Promise<Response>;

type HandlerOptions = {
  routeName: string;
  enableLogging?: boolean;
  maxRequestsPerMinute?: number;
};

function now() {
  return Date.now();
}

function buildRequestId() {
  return `req_${now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function withApiHandler(
  handler: ApiHandler,
  options: HandlerOptions
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const requestId = buildRequestId();
    const start = now();

    try {
      enforceRateLimit({
        request,
        routeName: options.routeName,
        maxRequestsPerMinute: options.maxRequestsPerMinute,
      });

      const response = await handler(request, { requestId });

      if (options.enableLogging) {
        const duration = now() - start;
        logApiRequest({
          routeName: options.routeName,
          requestId,
          method: request.method,
          durationMs: duration,
        });
      }

      return response;
    } catch (error) {
      const normalized = normalizeError(error);

      if (options.enableLogging) {
        const duration = now() - start;
        logApiError({
          routeName: options.routeName,
          requestId,
          durationMs: duration,
          status: normalized.status,
          code: normalized.code,
        });
      }

      return errorResponse(
        normalized.code,
        normalized.message,
        normalized.status,
        {
          requestId,
          details: normalized.details,
        }
      );
    }
  };
}
