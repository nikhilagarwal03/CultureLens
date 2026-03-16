const DEFAULT_API_BASE = "";

function normalizeBaseUrl(value: string | undefined): string {
  if (!value) return DEFAULT_API_BASE;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export const clientEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "CultureLens",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
  defaultUserLanguage: process.env.NEXT_PUBLIC_DEFAULT_USER_LANGUAGE || "en",
};
