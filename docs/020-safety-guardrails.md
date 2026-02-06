
# Safety Guardrails

Guardrails are enforced *before* AI is called:

- **Prompt injection screening** (conservative heuristics)
- **Redaction rules** (remove obvious secrets/PII patterns)
- **Path allow/deny policy** (never send sensitive files)
- **Diff-limited context assembly** (no whole-repo dumps)
- **Strict schema validation** (fail closed)

Guardrails are part of the system design, not “best effort.”

