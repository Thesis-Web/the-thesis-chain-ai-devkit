
# Overview

This devkit provides a repeatable pattern for AI-assisted engineering workflows:

1. Build a **diff-limited context**
2. Apply **redaction** before any provider call
3. Use **versioned prompt templates**
4. Require **schema-validated outputs**
5. Enforce **budgets and caching**
6. Emit **auditable artifacts** and GitHub comments

The goal is to get AI leverage without creating an unbounded, non-deterministic system.

