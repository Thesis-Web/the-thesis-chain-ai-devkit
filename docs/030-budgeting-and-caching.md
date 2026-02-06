
# Budgeting & Caching

High-leverage pattern:

- run cheap deterministic checks first
- only call AI on meaningful diffs
- cache by hashing (prompt + context + template version)

Budgets include:
- max calls
- max total input tokens
- max total output tokens

Caching prevents repeated spend on identical inputs.
