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
  height: 980,
  // Match website dark blue palette
  backgroundStart: "#000a14",
  backgroundEnd: "#0b1b2c",
  textPrimary: "#eff6ff",
  textMuted: "#8ea8c3",
  accent: "#69e2ff",
};

// Section icons for improved presentation
export const SECTION_ICONS: Record<string, string> = {
  Reference: "📖",
  "Origin Culture": "🌏",
  "Cultural Impact": "💥",
  "Local Analogy": "🔄",
  Context: "💬",
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
