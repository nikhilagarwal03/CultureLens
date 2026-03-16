import type { ExplainOutput } from "../explain";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import {
  isSupportedLanguage,
  normalizeLanguageCode,
  type SupportedLanguageCode,
} from "./supported-languages";

type LingoConfig = {
  apiKey: string;
  engineId: string;
};

let engineCache: { key: string; engine: LingoDotDevEngine } | null = null;

function getLingoConfig(): LingoConfig | null {
  const apiKey = process.env.LINGO_API_KEY?.trim();
  const engineId = process.env.LINGO_ENGINE_ID?.trim();

  if (!apiKey || !engineId) {
    return null;
  }

  return {
    apiKey,
    engineId, // Fixed: Property now correctly returned
  };
}

function getEngine(config: LingoConfig): LingoDotDevEngine {
  const cacheKey = `${config.apiKey}|${config.engineId}`;
  if (engineCache && engineCache.key === cacheKey) {
    return engineCache.engine;
  }

  const engine = new LingoDotDevEngine({
    apiKey: config.apiKey,
    engineId: config.engineId,
    apiUrl: "https://api.lingo.dev",
  });

  engineCache = { key: cacheKey, engine };
  return engine;
}

function toSupportedLocale(value?: string): SupportedLanguageCode | null {
  if (!value) return null;
  const normalized = normalizeLanguageCode(value);
  return isSupportedLanguage(normalized) ? normalized : null;
}

export type LocalizedExplainInput = {
  textForModel: string;
  normalizedLanguage: SupportedLanguageCode;
  inputWasTranslated: boolean;
  detectedTone?: string;
};

/**
 * Normalizes messy input into clean English for the LLM
 * while automatically detecting the user's source language.
 */
export async function localizeExplainInput(
  text: string,
  userLanguage?: string
): Promise<LocalizedExplainInput> {
  const config = getLingoConfig();
  const engine = config ? getEngine(config) : null;

  if (!engine) {
    return {
      textForModel: text,
      normalizedLanguage: normalizeLanguageCode(userLanguage) as SupportedLanguageCode,
      inputWasTranslated: false,
    };
  }

  try {
    const detected = await engine.recognizeLocale(text);
    const normalizedLanguage = toSupportedLocale(detected) || "en";

    const refinedEnglish = await engine.localizeText(text, {
      sourceLocale: normalizedLanguage,
      targetLocale: "en",
      fast: true,
      hints: {
        general: [
          "Clean up typos, slang, and messy grammar.",
          "Preserve the core cultural query while making it clear for an AI model.",
        ],
      },
    });

    return {
      textForModel: refinedEnglish || text,
      normalizedLanguage,
      inputWasTranslated: true,
    };
  } catch {
    return {
      textForModel: text,
      normalizedLanguage: normalizeLanguageCode(userLanguage) as SupportedLanguageCode,
      inputWasTranslated: false,
    };
  }
}

/**
 * Adapts LLM output into the user's language with tone-matching 
 * and local cultural transcreation.
 */
export async function localizeExplainOutput(
  output: Omit<ExplainOutput, "language">,
  userLanguage?: string,
  context?: {
    userCountry?: string;
    queryText?: string;
    detectedTone?: string;
  }
): Promise<ExplainOutput> {
  const language = normalizeLanguageCode(userLanguage);
  const config = getLingoConfig();
  
  if (!config) {
    return { ...output, language };
  }

  try {
    const engine = getEngine(config);
    const fields = {
      reference: output.reference,
      originCulture: output.originCulture,
      culturalImpact: output.culturalImpact,
      localAnalogy: output.localAnalogy,
      context: output.context,
    };

    // Explicitly define hints as a Record to bypass strict key matching errors
    const translationHints: Record<string, string[]> = {
      reference: ["Maintain the clarity of the core explanation."],
      originCulture: ["Preserve specific regional and community names accurately."],
      culturalImpact: ["Translate the significance while maintaining a concise tone."],
      localAnalogy: [
        `Target Audience Country: ${context?.userCountry || "Global"}.`,
        "Do not translate literally. Rewrite this analogy using a specific local cultural equivalent (sports, traditions, or food) that has similar social intensity.",
      ],
      context: [
        `Match user vibe: ${context?.detectedTone || "informative"}.`,
        "Preserve real-world usage context.",
      ],
    };

    const translated = await engine.localizeObject(fields, {
      sourceLocale: "en",
      targetLocale: language,
      fast: true,
      hints: translationHints,
      reference: {
        en: {
          queryText: context?.queryText ?? "",
          userCountry: context?.userCountry ?? "",
        },
      },
    });

    if (!translated) {
      return { ...output, language };
    }

    return {
      reference: String(translated.reference ?? output.reference),
      originCulture: String(translated.originCulture ?? output.originCulture),
      culturalImpact: String(translated.culturalImpact ?? output.culturalImpact),
      localAnalogy: String(translated.localAnalogy ?? output.localAnalogy),
      context: String(translated.context ?? output.context),
      language,
    };
  } catch {
    return { ...output, language };
  }
}