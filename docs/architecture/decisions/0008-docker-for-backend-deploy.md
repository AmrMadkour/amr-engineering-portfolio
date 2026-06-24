# 0008 — Docker for Backend Deployment (Supersedes Earlier "No Docker" Decision)

## Status
Accepted (supersedes the original Stage 1 decision to skip Docker)

## Context
The original architecture review concluded Docker added no value, since Vercel and Render both support native Next.js/.NET deploys without it. In practice, Render's native .NET runtime support did not line up cleanly with the project's .NET 10 + monorepo layout, and the API needs `content/` (at the monorepo root) bundled alongside it at build time.

## Decision
The backend deploys to Render as a Docker image. `apps/api/Dockerfile` is a multi-stage build (`sdk:10.0` → `aspnet:10.0`) built from the **monorepo root** as context, so `content/` can be copied into the image. `ContentPath` is set via env var inside the container. The entrypoint uses shell form so `${PORT}` (injected by Render at runtime) expands correctly — `ENV`/`ARG` substitution happens at build time, not runtime, so shell form is required for this to work.

## Consequences
- One extra artifact to maintain (`Dockerfile`, `.dockerignore`) versus a fully native deploy.
- Build context must stay rooted at the repo root — moving `content/` or changing the Dockerfile's `COPY` paths requires updating both together.
- Gains full control over the runtime image and guarantees `content/` is always in sync with the deployed code (no separate content-sync step).
