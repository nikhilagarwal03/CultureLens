import { callLLM } from "./ai/llm";
import { mapCultureToCultureAnalogy } from "./ai/analogy-mapping";
import { getCached, setCached } from "./ai/cache";
import { analyzeCulturalContext, summarizeCulturalContext } from "./ai/cultural-context";
import { findReferenceLibraryMatch, formatReferenceLibraryHint } from "./ai/reference-library";
import { detectReference, toReferenceCacheKey } from "./ai/reference-detection";
import { formatExplainResponse } from "./ai/response-formatter";
import { ApiError } from "./api/errors";
import { localizeExplainInput, localizeExplainOutput } from "./localization/lingo";
import { normalizeLanguageCode } from "./localization/supported-languages";

export type ExplainInput = {
  text: string;
  userCountry?: string;
  userLanguage?: string;
};

export type ExplainOutput = {
  reference: string;
  originCulture: string;
  culturalImpact: string;
  localAnalogy: string;
  context: string;
  language: string;
};

function buildQuotaFallback(params: {
  detectedReference: string;
  analogyFallback: string;
  culturalContextSummary: string;
}): Omit<ExplainOutput, "language"> {
  const reference = params.detectedReference || "this reference";
  return {
    reference,
    originCulture: "Global internet culture",
    culturalImpact:
      "Live AI explanation is temporarily limited due to provider quota, so this is a concise fallback summary.",
    localAnalogy: params.analogyFallback,
    context: params.culturalContextSummary,
  };
}

export async function explainCulture(input: ExplainInput): Promise<ExplainOutput> {
  const inputLocalization = await localizeExplainInput(input.text, input.userLanguage);
  const language = normalizeLanguageCode(inputLocalization.normalizedLanguage);
  const detection = detectReference(inputLocalization.textForModel);
  const normalizedReference = toReferenceCacheKey(detection);
  const culturalContext = analyzeCulturalContext({
    queryText: inputLocalization.textForModel,
    detectedReference: detection.candidate,
    referenceKind: detection.kind,
    userCountry: input.userCountry,
  });
  const culturalContextSummary = summarizeCulturalContext(culturalContext);
  const libraryMatch = findReferenceLibraryMatch(detection.candidate);
  const referenceLibraryHint = libraryMatch ? formatReferenceLibraryHint(libraryMatch) : undefined;
  const analogyMapping = mapCultureToCultureAnalogy({
    userCountry: input.userCountry,
    detectedReference: detection.candidate,
    referenceKind: detection.kind,
    domains: culturalContext.domains,
  });

  const cached = getCached(normalizedReference, input.userCountry, language);
  if (cached) {
    return await localizeExplainOutput(cached, language, {
      userCountry: input.userCountry,
      queryText: input.text,
    });
  }

  try {
    const result = await callLLM({
      text: inputLocalization.textForModel,
      userCountry: input.userCountry,
      // If input was translated to English by Lingo, force model output to English
      // so Lingo can apply consistent output translation for all fields.
      userLanguage: inputLocalization.inputWasTranslated ? "en" : language,
      detectedReference: detection.candidate,
      referenceKind: detection.kind,
      detectionConfidence: detection.confidence,
      culturalContextSummary,
      analogyHint: analogyMapping.hint,
      referenceLibraryHint,
    });
    const normalizedResult = formatExplainResponse({
      raw: result,
      detectedReference: detection.candidate,
      analogyFallback: analogyMapping.fallbackAnalogy,
    });

    setCached(normalizedReference, input.userCountry, language, normalizedResult);
    return await localizeExplainOutput(normalizedResult, language, {
      userCountry: input.userCountry,
      queryText: input.text,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw err;
  }
}
