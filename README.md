// TARGET: aidev README.md

# The Thesis Chain — AI Devkit

A provider-agnostic AI devkit for building **safe, auditable engineering agents**.

This repository focuses on the parts most teams get wrong:
- strict schemas at boundaries
- prompt versioning and deterministic gates
- redaction and prompt-injection resistance
- budgeting, caching, and traceability
- GitHub automation patterns (Actions + App-style architecture)

This is a **public skeleton** intended to demonstrate architecture and engineering posture.
Provider network calls are intentionally stubbed.

## Contents

- Docs
  - [Overview](docs/000-overview.md)
  - [Agent Architecture](docs/010-agent-architecture.md)
  - [Safety Guardrails](docs/020-safety-guardrails.md)
  - [Budgeting & Caching](docs/030-budgeting-and-caching.md)
  - [GitHub Automation](docs/040-github-automation.md)
  - [Evaluation & Metrics](docs/050-evaluation-and-metrics.md)
  - [Threat Model for Agents](docs/060-threat-model-for-agents.md)


- Code
  - `src/core/*` — contracts, safety boundaries, audit/caching
  - `src/agents/*` — example engineering agents
  - `src/runners/*` — local + GitHub runners
  - `.github/workflows/*` — demo CI integration
  - `scripts/*` — minimal demo runner

## Design Position

AI is treated as:
- a reviewer, synthesizer, and scenario generator

AI is not treated as:
- a source of truth
- a merger
- an authority

Deterministic checks remain authoritative. AI output remains advisory.
