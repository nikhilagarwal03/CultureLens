import { callOpenRouter } from "./openrouter";
import type { PromptInput } from "./prompts";

export type LLMOutput = {
  reference: string;
  originCulture: string;
  culturalImpact: string;
  localAnalogy: string;
  context: string;
};

export async function callLLM(input: PromptInput): Promise<LLMOutput> {
  return await callOpenRouter(input);
}
