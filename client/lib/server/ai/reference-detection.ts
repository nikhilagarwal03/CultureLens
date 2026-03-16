export type ReferenceKind =
  | "meme"
  | "hashtag"
  | "slang"
  | "person"
  | "event"
  | "media"
  | "unknown";

export type DetectedReference = {
  originalText: string;
  normalizedText: string;
  candidate: string;
  kind: ReferenceKind;
  confidence: number;
};

const INTENT_PREFIXES: RegExp[] = [
  /^(what is|what's|who is|who's|explain|tell me about|meaning of|define)\s+/i,
  /^(can you explain|please explain|i keep seeing|why is)\s+/i,
];

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripIntentPrefix(text: string): { value: string; removed: boolean } {
  let output = text;
  let removed = false;

  for (const pattern of INTENT_PREFIXES) {
    if (pattern.test(output)) {
      output = output.replace(pattern, "");
      removed = true;
    }
  }

  return { value: output.trim(), removed };
}

function extractQuotedReference(text: string): string | null {
  const match = text.match(/["'“”]([^"'“”]{2,120})["'“”]/);
  return match?.[1]?.trim() ?? null;
}

function stripTrailingPunctuation(text: string): string {
  return text.replace(/[.?!,:;]+$/g, "").trim();
}

function detectKind(candidate: string, normalizedText: string): ReferenceKind {
  const lower = candidate.toLowerCase();
  const fullLower = normalizedText.toLowerCase();

  if (candidate.startsWith("#")) return "hashtag";
  if (/\b(meme|copypasta|reaction image|shitpost|viral)\b/i.test(fullLower)) return "meme";
  if (/\b(slur|slang|phrase|acronym|abbrev|abbreviation)\b/i.test(fullLower)) return "slang";
  if (/\b(movie|show|anime|song|album|game|series)\b/i.test(fullLower)) return "media";
  if (/\b(war|election|protest|festival|movement|challenge)\b/i.test(fullLower)) return "event";
  if (/^[a-z]+(?:\s+[a-z]+){0,3}$/i.test(candidate) && /\b(who is|person|creator|artist|influencer)\b/i.test(fullLower)) {
    return "person";
  }
  if (/\b(rizz|skibidi|cap|gyat|sus|delulu|goated)\b/i.test(lower)) return "slang";

  return "unknown";
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(2));
}

function scoreConfidence(
  candidate: string,
  normalizedText: string,
  usedQuotedText: boolean,
  removedIntentPrefix: boolean,
  kind: ReferenceKind
): number {
  let score = 0.45;

  if (candidate.length >= 3 && candidate.length <= 80) score += 0.15;
  if (usedQuotedText) score += 0.2;
  if (removedIntentPrefix) score += 0.08;
  if (kind !== "unknown") score += 0.08;
  if (candidate !== normalizedText) score += 0.04;
  if (candidate.includes("http://") || candidate.includes("https://")) score -= 0.1;

  return clamp01(score);
}

export function detectReference(text: string): DetectedReference {
  const normalizedText = normalizeWhitespace(text);
  const quoted = extractQuotedReference(normalizedText);
  const stripped = stripIntentPrefix(normalizedText);

  const baseCandidate = quoted ?? stripped.value;
  const candidate = stripTrailingPunctuation(baseCandidate) || normalizedText;
  const kind = detectKind(candidate, normalizedText);
  const confidence = scoreConfidence(
    candidate,
    normalizedText,
    Boolean(quoted),
    stripped.removed,
    kind
  );

  return {
    originalText: text,
    normalizedText,
    candidate,
    kind,
    confidence,
  };
}

export function toReferenceCacheKey(detection: DetectedReference): string {
  return detection.candidate.toLowerCase();
}
