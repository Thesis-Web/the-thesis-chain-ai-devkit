// TARGET: aidev src/core/audit.ts

import type { LLMProvider } from "./types";

export type AuditEvent = Readonly<{
  kind: "llm_request" | "llm_response" | "llm_error";
  requestId: string;
  timestampMs: number;
  provider: LLMProvider;
  model: string;
  promptHash: string;
  contextHash: string;
  outputHash?: string;
  usage?: { inputTokens: number; outputTokens: number };
  error?: { name: string; message: string };
}>;

export interface AuditSink {
  record(event: AuditEvent): Promise<void>;
}

// Simple console sink for demo purposes
export function createConsoleAuditSink(): AuditSink {
  return {
    async record(e) {
      // Intentionally structured for log ingestion
      console.log(JSON.stringify(e));
    },
  };
}
