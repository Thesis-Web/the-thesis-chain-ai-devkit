// TARGET: aidev src/core/injection-guards.ts

export function assertNoObviousPromptInjection(material: string): void {
  // Conservative heuristics; false positives are acceptable in safety mode.
  const suspicious = [
    /ignore\s+previous\s+instructions/i,
    /override\s+system/i,
    /\bSYSTEM\s*:/i,
    /\bDEVELOPER\s*:/i,
    /reveal\s+secrets/i,
    /exfiltrate/i,
    /send\s+your\s+api\s+key/i,
  ];

  if (suspicious.some((r) => r.test(material))) {
    throw new Error("Prompt injection guard triggered");
  }
}
