
import type { LLMRequest, LLMProvider } from "../core/types";

export type ProviderResult = Readonly<{
  rawText: string;
  usage: { inputTokens: number; outputTokens: number };
  provider: LLMProvider;
  model: string;
}>;

export interface ProviderAdapter {
  provider: LLMProvider;
  call(req: LLMRequest, prompt: string): Promise<ProviderResult>;
}
