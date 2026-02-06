
# GitHub Automation

Two common integration models:

## A) GitHub Actions (CI-driven)
- runs on PR events
- generates an advisory report
- posts a PR comment

## B) GitHub App (webhook-driven)
- verifies webhook signatures
- mints installation tokens
- fetches changed files
- posts PR comments/check runs

This repo demonstrates Actions, plus a GitHub App architecture in code form.
