
import { buildSystemPrompt, buildUserPrompt, type PromptInput } from "./prompts";
import type { LLMOutput } from "./llm";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/*
  Ordered list of models to try.
  If the first fails (rate limit / outage), the next one is used.
*/
const MODELS = [
"nex-agi/nex-n2.5-mini:free"
];

function getOpenRouterApiKey(): string | null {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  return key ? key : null;
}

function parseJsonFromContent(content: string): LLMOutput {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as LLMOutput;
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(getOpenRouterApiKey());
}

async function tryModel(
  model: string,
  apiKey: string,
  input: PromptInput
): Promise<LLMOutput | null> {
  try {
    console.log(`[OpenRouter] Trying model: ${model}`);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "CultureLens",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(input) },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    const raw = await response.text();

    if (process.env.NODE_ENV !== "production") {
      console.log(`[OpenRouter] Raw response (${model}):`, raw);
    }

    if (!response.ok) {
      console.error(`[OpenRouter] ${model} failed (${response.status})`);
      return null;
    }

    const parsed: {
      choices?: Array<{ message?: { content?: string } }>;
    } = JSON.parse(raw);

    const content = parsed?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      console.error(`[OpenRouter] ${model} returned empty content`);
      return null;
    }

    return parseJsonFromContent(content);
  } catch (err) {
    console.error(`[OpenRouter] Error using ${model}:`, err);
    return null;
  }
}

export async function callOpenRouter(input: PromptInput): Promise<LLMOutput> {
  const apiKey = getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  let lastError: unknown = null;

  for (const model of MODELS) {
    const result = await tryModel(model, apiKey, input);

    if (result) {
      console.log(`[OpenRouter] Success with model: ${model}`);
      return result;
    }

    lastError = `Model failed: ${model}`;
  }

  throw new Error(`All OpenRouter models failed. Last error: ${lastError}`);
}

