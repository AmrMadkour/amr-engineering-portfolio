# Architecture Decision Records (ADRs)

This folder stores Architecture Decision Records — lightweight documents that capture the context, decision, and consequences of significant choices made during development.

## Why ADRs?

ADRs create an audit trail. When you revisit a decision months later, the "why" is preserved here — not lost in Slack or a PR description.

## Format

Each ADR is a markdown file named: `NNNN-short-title.md`

```markdown
# NNNN — Title

## Status
Proposed | Accepted | Deprecated | Superseded by NNNN

## Context
What situation prompted this decision?

## Decision
What was decided?

## Consequences
What are the trade-offs and implications?
```

## Index

| # | Title | Status |
|---|---|---|
| 0001 | [JSON Files as Content Layer, No Database](0001-json-content-no-database.md) | Accepted |
| 0002 | [Experience-First Architecture, No Standalone Projects Page](0002-experience-first-no-projects-page.md) | Accepted |
| 0003 | [No MediatR](0003-no-mediatr.md) | Accepted |
| 0004 | [Google Gemini over Semantic Kernel + OpenAI](0004-gemini-over-semantic-kernel.md) | Accepted |
| 0005 | [No Vector DB, Full Portfolio JSON in System Prompt](0005-no-vector-db-full-context.md) | Accepted |
| 0006 | [Gated Deploy Pipeline](0006-gated-deploy-pipeline.md) | Accepted |
| 0007 | [SSE Error Events Use Codes, Not Human-Readable Strings](0007-sse-error-codes-not-strings.md) | Accepted |
