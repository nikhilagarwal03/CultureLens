export type PromptInput = {
  text: string;
  userCountry?: string;
  userLanguage?: string;
  detectedReference?: string;
  referenceKind?: string;
  detectionConfidence?: number;
  culturalContextSummary?: string;
  analogyHint?: string;
  referenceLibraryHint?: string;
};

/**
 * Builds the system prompt for cultural explanation.
 * Instructs the model to respond ONLY with a valid JSON object — no markdown, no prose.
 */
export function buildSystemPrompt(): string {
  return `You are CultureLens, an expert cultural translator. Your job is to explain cultural references, memes, trends, slang, and pop-culture moments so that anyone — regardless of their background — can understand them.

Respond ONLY with a single valid JSON object. Do not include markdown code fences, extra commentary, or any text outside the JSON.

The JSON must have exactly these fields:
{
  "reference": "A clear, one-to-two sentence explanation of what this is.",
  "originCulture": "The country or community this originated from (e.g. 'United States', 'Japan', 'Global internet culture').",
  "culturalImpact": "Two to three sentences on its cultural significance, reach, or influence.",
  "localAnalogy": "A relatable comparison for someone from the given user country. If no country is provided, give a globally accessible analogy.",
  "context": "One to two sentences on when, where, and how people encounter or use this reference."
}`;
}

/**
 * Builds the user-turn message for a specific query.
 */
export function buildUserPrompt(input: PromptInput): string {
  const country = input.userCountry ? `User's country: ${input.userCountry}.` : "";
  const lang = input.userLanguage && input.userLanguage !== "en"
    ? `Respond in language code: ${input.userLanguage}.`
    : "";
  const detection = input.detectedReference
    ? `Detected reference candidate: "${input.detectedReference}". Category: ${input.referenceKind ?? "unknown"}. Confidence: ${(input.detectionConfidence ?? 0).toFixed(2)}.`
    : "";
  const culturalContext = input.culturalContextSummary
    ? `Cultural context analyzer: ${input.culturalContextSummary}`
    : "";
  const analogy = input.analogyHint
    ? `Analogy mapping guidance: ${input.analogyHint}`
    : "";
  const referenceLibrary = input.referenceLibraryHint
    ? `Reference library signal: ${input.referenceLibraryHint}`
    : "";
  const meta = [country, lang, detection, culturalContext, analogy, referenceLibrary].filter(Boolean).join(" ");
  return `Explain this cultural reference: "${input.text}". ${meta}`.trim();
}
