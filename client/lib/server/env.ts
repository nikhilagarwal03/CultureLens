type ConfigKey =
  | "MONGODB_URI"
  | "MONGODB_DB_NAME"
  | "LINGO_API_KEY"
  | "LINGO_ENGINE_ID"
  | "OPENROUTER_API_KEY";

type ConfigStatus = {
  configured: boolean;
  missingKeys: ConfigKey[];
  llmProvider: "openrouter" | "unconfigured";
};

function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

function detectLLMProvider(): ConfigStatus["llmProvider"] {
  const hasOpenRouter = hasValue(process.env.OPENROUTER_API_KEY);
  if (hasOpenRouter) {
    return "openrouter";
  }
  return "unconfigured";
}

export function getPhase1ConfigStatus(): ConfigStatus {
  const missingKeys: ConfigKey[] = [];

  if (!hasValue(process.env.MONGODB_URI)) {
    missingKeys.push("MONGODB_URI");
  }
  if (!hasValue(process.env.MONGODB_DB_NAME)) {
    missingKeys.push("MONGODB_DB_NAME");
  }
  if (!hasValue(process.env.LINGO_API_KEY)) {
    missingKeys.push("LINGO_API_KEY");
  }
  if (!hasValue(process.env.LINGO_ENGINE_ID)) {
    missingKeys.push("LINGO_ENGINE_ID");
  }

  const llmProvider = detectLLMProvider();
  if (llmProvider === "unconfigured") {
    missingKeys.push("OPENROUTER_API_KEY");
  }

  return {
    configured: missingKeys.length === 0,
    missingKeys,
    llmProvider,
  };
}
