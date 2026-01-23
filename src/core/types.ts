// TARGET: aidev src/core/types.ts

export type Severity = "info" | "warn" | "high";
export type Category = "structure" | "invariant" | "threat" | "diff" | "test";

export type Finding = Readonly<{
  id: string;
  severity: Severity;
  category: Category;
  claim: string;
  evidence_refs: string[];
  suggested_action?: string;
}>;

export type Report = Readonly<{
  agent: string;
  version: string;
  input_hash: string;
  output_hash: string;
  findings: Finding[];
  notes?: string[];
}>;

export type RepoRef = Readonly<{ owner: string; name: string }>;

export type PRRef = Readonly<{ number: number; headSha: string }>;

export type FileBlob = Readonly<{ path: string; content: string }>;

export type AgentContext = Readonly<{
  repo: RepoRef;
  pr?: PRRef; // optional for local runs
  diffSummary: string;
  changedFiles: FileBlob[];
  promptVersion: string;
}>;

export type JSONSchemaLike = Readonly<{
  title?: string;
  type: "object";
  required?: readonly string[];
  properties?: Record<string, unknown>;
}>;

export type LLMProvider = "stub" | "openai" | "azure_openai" | "anthropic" | "vertex";

export type ModelSpec = Readonly<{
  provider: LLMProvider;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}>;

export type Budget = Readonly<{
  maxCalls: number;
  maxTotalInputTokens: number;
  maxTotalOutputTokens: number;
}>;

export type LLMRequest = Readonly<{
  requestId: string;
  system: string;
  task: string;
  constraints: readonly string[];
  outputSchema: JSONSchemaLike;
  model: ModelSpec;

  context: Readonly<{
    diffSummary: string;
    files: FileBlob[];
  }>;

  sampling?: Readonly<{ top_p?: number; seed?: number }>;
}>;

export type LLMResponse = Readonly<{
  requestId: string;
  provider: LLMProvider;
  model: string;
  rawText: string;
  parsed: Report;
  usage: Readonly<{ inputTokens: number; outputTokens: number }>;
  audit: Readonly<{
    promptHash: string;
    contextHash: string;
    outputHash: string;
    timestampMs: number;
  }>;
}>;
