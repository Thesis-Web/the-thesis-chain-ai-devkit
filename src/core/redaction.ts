// TARGET: aidev src/core/redaction.ts

export type RedactionRule = Readonly<{
  id: string;
  pattern: RegExp;
  replacement: string;
}>;

export const DefaultRedactionRules: readonly RedactionRule[] = [
  {
    id: "api-keys/basic",
    pattern: /\b(sk-[A-Za-z0-9]{16,})\b/g,
    replacement: "sk-REDACTED",
  },
  {
    id: "emails",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replacement: "EMAIL_REDACTED",
  },
];

export function redact(text: string, rules: readonly RedactionRule[] = DefaultRedactionRules): string {
  return rules.reduce((acc, r) => acc.replace(r.pattern, r.replacement), text);
}
