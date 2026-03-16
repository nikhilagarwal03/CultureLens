import type { LLMOutput } from "./llm";

type FormatInput = {
  raw: LLMOutput;
  detectedReference: string;
  analogyFallback: string;
};

function sanitize(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureSentence(value: string, fallback: string): string {
  const cleaned = sanitize(value);
  if (!cleaned) return fallback;
  return /[.?!]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

export function formatExplainResponse(input: FormatInput): LLMOutput {
  const reference = sanitize(input.raw.reference) || input.detectedReference;
  const originCulture = sanitize(input.raw.originCulture) || "Global internet culture";
  const culturalImpact = ensureSentence(
    input.raw.culturalImpact,
    "It gained visibility through repeated sharing and online discussion across communities."
  );
  const localAnalogy = ensureSentence(input.raw.localAnalogy, input.analogyFallback);
  const context = ensureSentence(
    input.raw.context,
    "People usually encounter it in online conversations, short-form content, or social media threads."
  );

  return {
    reference,
    originCulture,
    culturalImpact,
    localAnalogy,
    context,
  };
}
