# 0002 — Experience-First Architecture, No Standalone Projects Page

## Status
Accepted

## Context
~95% of projects belong to a specific job. A standalone `/projects` page would present work detached from the context that explains it — team size, business domain, constraints. Recruiters care about roles, not a decontextualised project list.

## Decision
Projects are removed from top-level navigation. They surface only inside experience detail pages (`/experience/[slug]`). The navbar is Home / Experience / Contact only. The `/projects` route was deleted.

## Consequences
- Projects are always seen in context of the role that produced them.
- No way to browse projects cross-cutting across jobs — acceptable given the portfolio's goal.
- Personal/freelance work gets its own `type: "personal" | "freelance"` experience entry with `company: null`.
- Homepage preview shows 3 `featured: true` experience cards, not project cards.
