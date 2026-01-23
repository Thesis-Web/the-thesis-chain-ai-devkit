// TARGET: aidev src/agents/spec-lint.agent.ts

import type { AgentContext, Report, LLMRequest } from "../core/types";
import { createLLMClient } from "../core/llm-client";
import { SpecLintTemplate } from "../core/prompt-templates";
import { sha256 } from "../core/util";

export async function runSpecLint(ctx: AgentContext): Promise<Report> {
  const client = createLLMClient();

  const req: LLMRequest = {
    requestId: `speclint:${ctx.promptVersion}:${sha256(ctx.diffSummary)}`,
    system: SpecLintTemplate.system,
    task: SpecLintTemplate.task,
    constraints: SpecLintTemplate.constraints,
    outputSchema: SpecLintTemplate.outputSchema,
    model: {
      provider: "stub",
      model: "stub-model",
      temperature: 0.1,
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
