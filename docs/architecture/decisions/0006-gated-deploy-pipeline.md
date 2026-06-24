# 0006 — Gated Deploy Pipeline (CI must pass before deploy fires)

## Status
Accepted

## Context
Two deployment targets: Vercel (frontend) and Render (backend). Deploys are triggered via webhook URLs stored as GitHub secrets. The question was whether deploys should fire on every push to `main` or only after the quality gate passes.

## Decision
`deploy.yml` uses `workflow_run` on `ci.yml` with `conclusion == 'success'` and `head_branch == 'main'`. Deploy hooks only fire if CI is green. Branch protection on `main` requires a PR and both `CI / frontend` + `CI / backend` checks to pass before merge.

## Consequences
- Broken code cannot reach production — deploy is blocked at two levels (PR gate + deploy gate).
- Slightly slower feedback loop: CI (~3 min) must complete before deploy starts.
- A direct push to `main` (bypassing PR) would not trigger deploy — the `workflow_run` condition on `head_branch == 'main'` still requires CI to pass.
