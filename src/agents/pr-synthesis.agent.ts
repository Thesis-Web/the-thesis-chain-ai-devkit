// TARGET: aidev src/agents/pr-synthesis.agent.ts

import type { AgentContext, Report, LLMRequest } from "../core/types";
import { createLLMClient } from "../core/llm-client";
import { PRSynthesisTemplate } from "../core/prompt-templates";
import { sha256 } from "../core/util";

export async function runPRSynthesis(ctx: AgentContext): Promise<Report> {
  const client = createLLMClient();

  const req: LLMRequest = {
    requestId: `prsynth:${ctx.promptVersion}:${sha256(ctx.diffSummary)}`,
    system: PRSynthesisTemplate.system,
    task: PRSynthesisTemplate.task,
    constraints: PRSynthesisTemplate.constraints,
    outputSchema: PRSynthesisTemplate.outputSchema,
    model: {
      provider: "stub",
      model: "stub-model",
      temperature: 0.2,
      maxOutputTokens: 1500,
    },
    context: {
      diffSummary: ctx.diffSummary,
      files: ctx.changedFiles,
    },
  };

  const res = await client.invoke(req);
  return res.parsed;
}
