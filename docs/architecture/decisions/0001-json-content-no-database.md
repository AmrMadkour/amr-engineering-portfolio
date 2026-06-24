# 0001 — JSON Files as Content Layer, No Database

## Status
Accepted

## Context
The portfolio displays read-only data: profile, experience, projects, recommendations, skills. Content updates are infrequent (tied to career events) and always go through git. A database would add infra cost, ops overhead, and a migration story for no benefit.

## Decision
All portfolio content lives in `content/{en,ar,nl}/*.json` files committed to the repo. The backend reads these via `JsonContentRepository` with a 15-min `IMemoryCache` TTL. Content updates require a git push and redeploy.

## Consequences
- Zero database cost or ops burden.
- Content changes require a deploy — acceptable for a personal portfolio.
- No admin UI possible without a rethink; not needed.
- Two-tier cache (IMemoryCache 15 min + Next.js ISR 1 hr) means content is never stale by more than ~75 min in production.
