// TARGET: aidev src/agents/threat-sketch.agent.ts

import type { AgentContext, Report, LLMRequest } from "../core/types";
import { createLLMClient } from "../core/llm-client";
import { sha256 } from "../core/util";

/*
  ThreatSketchAgent (Domain-neutral)

  Produces high-level threat categories and mitigation suggestions.
  Constraints explicitly forbid procedural exploitation steps.
*/

export async function runThreatSketch(ctx: AgentContext): Promise<Report> {
  const client = createLLMClient();

  const req: LLMRequest = {
    requestId: `threatsketch:${ctx.promptVersion}:${sha256(ctx.diffSummary)}`,
    system:
      "You are a security-minded engineering reviewer. You remain conceptual and do not provide exploitation steps.",
    task:
      "Identify conceptual threat categories and failure modes suggested by the diff and files. Provide high-level mitigations only.",
    constraints: [
      "Do not provide step-by-step exploitation instructions.",
      "Do not request secrets or private data.",
      "Stay at the level of categories, risks, and mitigations.",
      "Output must be strict JSON matching the schema.",
    ],
    outputSchema: {
      title: "Report",
      type: "object",
      required: ["agent", "version", "input_hash", "output_hash", "findings"],
    },
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
  return {
    ...res.parsed,
    agent: "ThreatSketchAgent",
  };
}

