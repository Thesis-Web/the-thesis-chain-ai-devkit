
import type { ProviderAdapter, ProviderResult } from "./provider.interface";
import type { LLMRequest } from "../core/types";
import { sha256, estimateTokens } from "../core/util";

export const StubProvider: ProviderAdapter = {
  provider: "stub",
  async call(req: LLMRequest, prompt: string): Promise<ProviderResult> {
    // Emit schema-valid JSON shaped as a Report
    const rawText = JSON.stringify({
      agent: "PRSynthesisAgent",
      version: "1.0.0",
      input_hash: sha256(prompt),
      output_hash: sha256("stub-output"),
      findings: [
        {
          id: "stub/advisory",
          severity: "info",
          category: "diff",
          claim:
            "Stub provider. Replace with a real adapter privately (OpenAI/Azure/Anthropic/etc.) and keep schema validation + guardrails unchanged.",
          evidence_refs: [],
          suggested_action: "Implement ProviderAdapter.call() with your chosen provider and strict output schema checks.",
        },
      ],
      notes: [`requestId=${req.requestId}`, `model=${req.model.provider}:${req.model.model}`],
    });

    return {
      rawText,
      usage: { inputTokens: estimateTokens(prompt), outputTokens: estimateTokens(rawText) },
      provider: "stub",
      model: req.model.model,
    };
  },
};
