
# Agent Architecture

Agents are small modules with:

- a name + version
- a prompt template (versioned)
- an output schema
- deterministic gates (schema validation + policy checks)

Agents emit a structured report format that can be:
- scored
- diffed
- cached
- audited
- rendered into human-friendly PR comments

AI output never bypasses validation boundaries.

