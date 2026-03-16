import type { ReferenceKind } from "./reference-detection";

export type CulturalContext = {
  domains: string[];
  platforms: string[];
  geographyHints: string[];
  temporalHint: "historical" | "current" | "ongoing" | "unknown";
  audienceLens: string;
  confidence: number;
};

type ContextInput = {
  queryText: string;
  detectedReference: string;
  referenceKind: ReferenceKind;
  userCountry?: string;
};

const DOMAIN_PATTERNS: Array<{ domain: string; pattern: RegExp }> = [
  { domain: "sports", pattern: /\b(super bowl|fifa|nba|ipl|olympics|world cup|match|league)\b/i },
  { domain: "music", pattern: /\b(song|album|artist|band|k-pop|rap|spotify|concert)\b/i },
  { domain: "gaming", pattern: /\b(game|gaming|streamer|twitch|esports|speedrun|roblox|fortnite)\b/i },
  { domain: "film-tv", pattern: /\b(movie|film|series|show|netflix|anime|drama|episode)\b/i },
  { domain: "internet-meme", pattern: /\b(meme|viral|shitpost|copypasta|trend|reaction image)\b/i },
  { domain: "slang-language", pattern: /\b(slang|phrase|acronym|abbreviation|what does|meaning)\b/i },
  { domain: "politics-society", pattern: /\b(election|policy|protest|movement|government|culture war)\b/i },
];

const PLATFORM_PATTERNS: Array<{ platform: string; pattern: RegExp }> = [
  { platform: "tiktok", pattern: /\b(tiktok|tik tok)\b/i },
  { platform: "instagram", pattern: /\b(instagram|reels)\b/i },
  { platform: "x-twitter", pattern: /\b(twitter|x\.com|x app|tweet)\b/i },
  { platform: "reddit", pattern: /\b(reddit|subreddit)\b/i },
  { platform: "youtube", pattern: /\b(youtube|shorts)\b/i },
  { platform: "twitch", pattern: /\b(twitch|livestream|stream)\b/i },
];

const GEOGRAPHY_PATTERNS: Array<{ region: string; pattern: RegExp }> = [
  { region: "United States", pattern: /\b(us|usa|american|super bowl|nfl|thanksgiving)\b/i },
  { region: "Japan", pattern: /\b(japan|japanese|anime|manga|senpai)\b/i },
  { region: "South Korea", pattern: /\b(korea|korean|k-pop|kdrama|k-drama)\b/i },
  { region: "India", pattern: /\b(india|indian|bollywood|ipl|cricket)\b/i },
  { region: "Global internet", pattern: /\b(global|internet|online|viral|meme)\b/i },
];

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function detectTemporalHint(text: string): CulturalContext["temporalHint"] {
  if (/\b(today|now|currently|trending|viral|this year|202[4-9]|202\d)\b/i.test(text)) {
    return "current";
  }
  if (/\b(history|origin|started|first appeared|decade|19\d{2}|20[01]\d)\b/i.test(text)) {
    return "historical";
  }
  if (/\b(still|ongoing|continues|over time)\b/i.test(text)) {
    return "ongoing";
  }
  return "unknown";
}

function scoreConfidence(input: ContextInput, context: Omit<CulturalContext, "confidence" | "audienceLens">): number {
  let score = 0.42;

  if (context.domains.length > 0) score += 0.18;
  if (context.platforms.length > 0) score += 0.12;
  if (context.geographyHints.length > 0) score += 0.1;
  if (context.temporalHint !== "unknown") score += 0.08;
  if (input.referenceKind !== "unknown") score += 0.06;

  return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}

export function analyzeCulturalContext(input: ContextInput): CulturalContext {
  const text = `${input.queryText} ${input.detectedReference}`.trim();

  const domains = dedupe(
    DOMAIN_PATTERNS.filter((entry) => entry.pattern.test(text)).map((entry) => entry.domain)
  );

  const platforms = dedupe(
    PLATFORM_PATTERNS.filter((entry) => entry.pattern.test(text)).map((entry) => entry.platform)
  );

  const geographyHints = dedupe(
    GEOGRAPHY_PATTERNS.filter((entry) => entry.pattern.test(text)).map((entry) => entry.region)
  );

  const temporalHint = detectTemporalHint(text);
  const audienceLens = input.userCountry
    ? `Prioritize analogy and tone for users in ${input.userCountry}.`
    : "Use globally accessible comparisons when local equivalents are uncertain.";

  const confidence = scoreConfidence(input, {
    domains,
    platforms,
    geographyHints,
    temporalHint,
  });

  return {
    domains,
    platforms,
    geographyHints,
    temporalHint,
    audienceLens,
    confidence,
  };
}

export function summarizeCulturalContext(context: CulturalContext): string {
  const domains = context.domains.length > 0 ? context.domains.join(", ") : "unspecified";
  const platforms = context.platforms.length > 0 ? context.platforms.join(", ") : "unspecified";
  const geo = context.geographyHints.length > 0 ? context.geographyHints.join(", ") : "unspecified";

  return [
    `Context domains: ${domains}.`,
    `Likely platforms: ${platforms}.`,
    `Geographic hints: ${geo}.`,
    `Temporal hint: ${context.temporalHint}.`,
    `Audience lens: ${context.audienceLens}`,
    `Analyzer confidence: ${context.confidence.toFixed(2)}.`,
  ].join(" ");
}
