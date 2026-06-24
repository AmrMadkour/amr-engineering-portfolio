# 0004 — Google Gemini over Semantic Kernel + OpenAI

## Status
Accepted

## Context
Phase 3 originally specified Semantic Kernel + OpenAI for the AI chat widget. Requirements: multilingual (EN/AR/NL), function calling (navigate pages, open links), SSE streaming, free tier for a personal portfolio.

## Decision
Replaced with Google Gemini 2.0 Flash (`gemini-flash-latest`) via `Mscc.GenerativeAI` NuGet package directly — no orchestration layer.

## Consequences
- Free tier: 1M tokens/day — sufficient for a portfolio with low traffic.
- Superior Arabic and Dutch support over GPT-3.5/4 at the same price point.
- Native function calling without Semantic Kernel's plugin abstraction overhead.
- Quota is per Google Cloud project, not per API key — exhausting quota requires a new project, not just a new key.
- `Mscc.GenerativeAI` wraps some Gemini error responses (e.g. 429) in `JsonException`, requiring `ClassifyGeminiError()` to inspect exception message strings as a workaround.
