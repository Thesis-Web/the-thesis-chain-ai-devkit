// TARGET: aidev src/core/schema.ts

import type { Report, JSONSchemaLike } from "./types";

/**
 * Public skeleton:
 * - keeps schema validation lightweight and deterministic
 * - demonstrates the boundary where AI output becomes acceptable input
 *
 * In production:
 * - replace with a full validator (e.g., Ajv/Zod)
 */
export function parseAndValidateReport(rawText: string, _schema: JSONSchemaLike): Report {
  let obj: unknown;
  try {
    obj = JSON.parse(rawText);
  } catch {
    throw new Error("LLM output is not valid JSON");
  }

  if (!isReport(obj)) {
    throw new Error("LLM output failed Report validation");
  }

  return obj;
}

function isReport(x: unknown): x is Report {
  if (!x || typeof x !== "object") return false;
  const o = x as any;

  if (typeof o.agent !== "string") return false;
  if (typeof o.version !== "string") return false;
  if (typeof o.input_hash !== "string") return false;
  if (typeof o.output_hash !== "string") return false;
  if (!Array.isArray(o.findings)) return false;

  for (const f of o.findings) {
    if (!f || typeof f !== "object") return false;
    if (typeof (f as any).id !== "string") return false;
    if (typeof (f as any).severity !== "string") return false;
    if (typeof (f as any).category !== "string") return false;
    if (typeof (f as any).claim !== "string") return false;
    if (!Array.isArray((f as any).evidence_refs)) return false;
  }

  return true;
}
