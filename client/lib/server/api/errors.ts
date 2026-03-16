export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError(500, "INTERNAL_ERROR", "Something went wrong.");
}
