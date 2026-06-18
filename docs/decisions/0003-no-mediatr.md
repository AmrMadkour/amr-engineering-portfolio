# 0003 — No MediatR

## Status
Accepted

## Context
The backend has 4 read-only GET endpoints and 1 POST chat endpoint. MediatR is typically introduced to decouple command/query dispatch from controllers in large APIs.

## Decision
Endpoints inject `IContentRepository` and `IChatService` directly. No MediatR, no command/query objects beyond the existing DTOs.

## Consequences
- Less indirection — each endpoint is one file, easy to trace.
- The interface boundary in `Application/` (`IContentRepository`, `IChatService`) is the CQRS seam if MediatR is ever needed later; introducing it would be additive, not a rewrite.
- Adds no overhead for 5 endpoints.
