import type { ReferenceKind } from "./reference-detection";

export type AnalogyMapping = {
  hint: string;
  fallbackAnalogy: string;
  confidence: number;
};

type AnalogyInput = {
  userCountry?: string;
  detectedReference: string;
  referenceKind: ReferenceKind;
  domains: string[];
};

const DEFAULT_BY_DOMAIN: Record<string, string> = {
  sports: "a major national championship event",
  music: "a breakout hit that dominates mainstream conversation",
  gaming: "a game or creator trend everyone in a community suddenly talks about",
  "film-tv": "a widely discussed blockbuster release",
  "internet-meme": "a recurring inside joke spreading across social apps",
  "slang-language": "a phrase that quickly signals in-group internet fluency",
  "politics-society": "a public conversation that shapes everyday social debate",
};

const COUNTRY_DEFAULTS: Record<string, string> = {
  india: "like an IPL-final-level mainstream moment in India",
  "united states": "like a Super Bowl-week cultural moment in the US",
  japan: "like a nationally discussed anime-season release in Japan",
  "south korea": "like a top K-pop comeback conversation in South Korea",
  brazil: "like a Brazil-wide football final conversation",
  germany: "like a Bundesliga title-race conversation in Germany",
};

function normalizeCountry(country?: string): string {
  return (country ?? "").trim().toLowerCase();
}

function pickDomainAnalogy(domains: string[]): string {
  for (const domain of domains) {
    if (DEFAULT_BY_DOMAIN[domain]) {
      return DEFAULT_BY_DOMAIN[domain];
    }
  }
  return "a familiar local pop-culture reference with similar social visibility";
}

export function mapCultureToCultureAnalogy(input: AnalogyInput): AnalogyMapping {
  const normalizedCountry = normalizeCountry(input.userCountry);
  const localAnchor = COUNTRY_DEFAULTS[normalizedCountry] ?? "like a nationally familiar cultural reference in the user's country";
  const domainAnchor = pickDomainAnalogy(input.domains);

  const hint = [
    `Reference candidate: ${input.detectedReference}.`,
    `Reference kind: ${input.referenceKind}.`,
    `Domain baseline: ${domainAnchor}.`,
    `Country anchor: ${localAnchor}.`,
    "Choose an analogy from the same social intensity and audience familiarity level.",
  ].join(" ");

  const fallbackAnalogy = `It is ${domainAnchor}, ${localAnchor}.`;

  let confidence = 0.5;
  if (input.domains.length > 0) confidence += 0.2;
  if (input.referenceKind !== "unknown") confidence += 0.15;
  if (normalizedCountry && COUNTRY_DEFAULTS[normalizedCountry]) confidence += 0.1;

  return {
    hint,
    fallbackAnalogy,
    confidence: Math.min(1, Number(confidence.toFixed(2))),
  };
}
