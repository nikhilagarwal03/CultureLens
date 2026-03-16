export const SUPPORTED_LANGUAGE_CODES = [
  "en",
  "hi",
  "es",
  "fr",
  "de",
  "ja",
  "ko",
  "zh",
  "pt",
  "ar",
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];

export function normalizeLanguageCode(language?: string): SupportedLanguageCode {
  const fallback: SupportedLanguageCode = "en";
  if (!language || !language.trim()) return fallback;

  const normalized = language.trim().toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGE_CODES.includes(normalized as SupportedLanguageCode)
    ? (normalized as SupportedLanguageCode)
    : fallback;
}

export function isSupportedLanguage(language?: string): boolean {
  if (!language) return false;
  const normalized = language.trim().toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGE_CODES.includes(normalized as SupportedLanguageCode);
}
