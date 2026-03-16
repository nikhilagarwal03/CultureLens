import { apiClient } from "./api";
import type { ExplainResult } from "./explain-storage";

type SearchInput = {
  text: string;
  userCountry?: string;
  userLanguage?: string;
};

export async function searchCultureReference(input: SearchInput): Promise<ExplainResult> {
  return await apiClient.post<ExplainResult>("/api/explain", {
    text: input.text,
    userCountry: input.userCountry,
    userLanguage: input.userLanguage,
  });
}
