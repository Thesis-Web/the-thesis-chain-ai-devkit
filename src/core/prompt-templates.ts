
import type { JSONSchemaLike } from "./types";

export type PromptTemplate = Readonly<{
  id: string;
  version: string;
  system: string;
  task: string;
  constraints: readonly string[];
  outputSchema: JSONSchemaLike;
}>;

export const ReportSchema: JSONSchemaLike = {
  title: "Report",
  type: "object",
  required: ["agent", "version", "input_hash", "output_hash", "findings"],
};

export const PRSynthesisTemplate: PromptTemplate = {
  id: "pr-synthesis",
  version: "1.0.0",
  system:
    "You are an engineering review instrument. You do not invent facts. You only cite provided context.",
  task:
    "Produce an advisory PR review: summarize changes, highlight risks, and flag ambiguity. Keep findings actionable.",
  constraints: [
    "Do not provide deployment instructions.",
    "Do not request secrets or private data.",
    "If uncertain, mark uncertainty explicitly.",
    "Output must be strict JSON matching the schema.",
  ],
  outputSchema: ReportSchema,
};

export const SpecLintTemplate: PromptTemplate = {
  id: "spec-lint",
  version: "1.0.0",
  system:
    "You are a specification lint tool. You are strict, conservative, and do not guess missing facts.",
  task:
    "Find missing definitions, ambiguous terms, broken references, and claims that exceed available evidence.",
  constraints: [
    "No implementation instructions.",
    "No security exploitation steps.",
    "Output must be strict JSON matching the schema.",
  ],
  outputSchema: ReportSchema,
};
