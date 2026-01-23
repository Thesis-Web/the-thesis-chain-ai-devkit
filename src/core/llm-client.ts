// TARGET: aidev src/core/llm-client.ts

import type { LLMRequest, LLMResponse } from "./types";
import type { Policy } from "./policy";
import { DefaultPolicy } from "./policy";
import { redact, DefaultRedactionRules } from "./redaction";
import { assertNoObviousPromptInjection } from "./injection-guards";
import { parseAndValidateReport } from "./schema";
import { sha256 } from "./util";
import type { CacheStore } from "./cache";
import type { AuditSink } from "./audit";
import type { ProviderAdapter } from "../adapters/provider.interface";
import { StubProvider } from "../adapters/provider.stub";

export type LLMClientOptions = Readonly<{
  policy?: Policy;
  cache?: CacheStore;
  audit?: AuditSink;
  provider?: ProviderAdapter;
}>;

export interface LLMClient {
  invoke(req: LLMRequest): Promise<LLMResponse>;
}

export function createLLMClient(opts: LLMClientOptions = {}): LLMClient {
  const policy = opts.policy ?? DefaultPolicy;
  const cache = opts.cache;
  const audit = opts.audit;
  const provider = opts.provider ?? StubProvider;

  // process-local budget counters
  let calls = 0;
  let inTok = 0;
  let outTok = 0;

  return {
    async invoke(req: LLMRequest): Promise<LLMResponse> {
      // 1) Redact aggressively before any provider call
      const redacted = applyRedaction(req);

      // 2) Prompt injection guard (preflight)
      if (policy.promptInjectionGuard) {
        assertNoObviousPromptInjection(materialForGuard(redacted));
      }

      // 3) Build prompt envelope (versioned discipline implied)
      const prompt = buildPrompt(redacted);

      // 4) Cache key = policy namespace + model + prompt hash + context hash
      const promptHash = sha256(prompt);
      const contextHash = sha256(
        redacted.context.diffSummary +
          "\n" +
          redacted.context.files.map((f) => `${f.path}:${sha256(f.content)}`).join("|")
      );
      const cacheKey = `aidev:${policy.model.provider}:${policy.model.model}:${promptHash}:${contextHash}`;

      if (cache) {
        const hit = await cache.get(cacheKey);
        if (hit) return hit;
      }

      // 5) Budget enforcement
      enforceBudget(policy, calls, inTok, outTok);

      await audit?.record({
        kind: "llm_request",
        requestId: redacted.requestId,
        timestampMs: Date.now(),
        provider: provider.provider,
        model: redacted.model.model,
        promptHash,
        contextHash,
      });

      // 6) Provider call (stub by default)
      const res = await provider.call(redacted, prompt);

      // 7) Deterministic boundary: parse + schema validate (fail closed)
      const parsed = parseAndValidateReport(res.rawText, redacted.outputSchema);

      calls += 1;
      inTok += res.usage.inputTokens;
      outTok += res.usage.outputTokens;

      const outputHash = sha256(JSON.stringify(parsed));

      const out: LLMResponse = {
        requestId: redacted.requestId,
        provider: res.provider,
        model: res.model,
        rawText: res.rawText,
        parsed,
        usage: res.usage,
        audit: {
          promptHash,
          contextHash,
          outputHash,
          timestampMs: Date.now(),
        },
      };

      await audit?.record({
        kind: "llm_response",
        requestId: redacted.requestId,
        timestampMs: Date.now(),
        provider: res.provider,
        model: res.model,
        promptHash,
        contextHash,
        outputHash,
        usage: res.usage,
      });

      if (cache) {
        await cache.set(cacheKey, out, 60 * 60 * 24); // 24h
      }

      return out;
    },
  };
}

function enforceBudget(policy: Policy, calls: number, inTok: number, outTok: number): void {
  const b = policy.budget;
  if (calls >= b.maxCalls) throw new Error("Budget exceeded: maxCalls");
  if (inTok >= b.maxTotalInputTokens) throw new Error("Budget exceeded: maxTotalInputTokens");
  if (outTok >= b.maxTotalOutputTokens) throw new Error("Budget exceeded: maxTotalOutputTokens");
}

function applyRedaction(req: LLMRequest): LLMRequest {
  const r = DefaultRedactionRules;
  const red = (s: string) => redact(s, r);

  return {
    ...req,
    system: red(req.system),
    task: red(req.task),
    constraints: req.constraints.map(red),
    context: {
      diffSummary: red(req.context.diffSummary),
      files: req.context.files.map((f) => ({ path: f.path, content: red(f.content) })),
    },
  };
}

function buildPrompt(req: LLMRequest): string {
  const lines: string[] = [];
  lines.push(`SYSTEM:\n${req.system}`);
  lines.push(`\nTASK:\n${req.task}`);
  lines.push(`\nCONSTRAINTS:\n- ${req.constraints.join("\n- ")}`);
  lines.push(`\nOUTPUT_SCHEMA:\n${JSON.stringify(req.outputSchema)}`);
  lines.push(`\nCONTEXT_DIFF_SUMMARY:\n${req.context.diffSummary}`);
  lines.push(`\nCONTEXT_FILES:`);
  for (const f of req.context.files) {
    lines.push(`\n--- FILE: ${f.path} ---\n${f.content}`);
  }
  return lines.join("\n");
}

function materialForGuard(req: LLMRequest): string {
  return [
    req.system,
    req.task,
    ...req.constraints,
    req.context.diffSummary,
    ...req.context.files.map((f) => f.content),
  ].join("\n");
}
