import { ApiError } from "@/lib/server/api/errors";

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Invalid JSON body.");
  }
}

export function requireNonEmptyString(
  value: unknown,
  fieldName: string
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, "VALIDATION_ERROR", `'${fieldName}' is required.`);
  }
  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}
