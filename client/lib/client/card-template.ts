import type { ExplainResult } from "./explain-storage";

export type ShareCardTemplate = {
  width: number;
  height: number;
  backgroundStart: string;
  backgroundEnd: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
};

export const DEFAULT_SHARE_CARD_TEMPLATE: ShareCardTemplate = {
  width: 1400,
  height: 950,
  // Match site panel gradient (example: soft blue/gray)
  backgroundStart: "#f7fafc", // panel background (light)
  backgroundEnd: "#e5e7eb",   // panel background (slightly darker)
  textPrimary: "#181f2a",     // ink (site text)
  textMuted: "#6b7280",       // ink-soft (site muted)
  accent: "#2dd4bf",          // accent (site accent)
};

export type ShareCardData = {
  query: string;
  result: ExplainResult;
};

export function toShareCardSections(data: ShareCardData): Array<{ label: string; value: string }> {
  // Match the shared card and ResultCard layout/labels
  return [
    { label: "Reference", value: data.result.reference },
    { label: "Origin Culture", value: data.result.originCulture },
    { label: "Cultural Impact", value: data.result.culturalImpact },
    { label: "Local Analogy", value: data.result.localAnalogy },
    { label: "Context", value: data.result.context },
  ];
}
