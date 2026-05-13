# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Status

**Phase 1.1 (Monorepo Scaffold) — COMPLETE**
**Phase 1.2 (Backend Foundation) — NEXT**

Full architecture decisions and implementation roadmap: `docs/planning/Stage1/3-ArchitectureReview.md`

---

## Commands

### Install
```bash
npm install          # run from repo root — installs all workspaces
```

### Frontend (`apps/web`)
```bash
npm run dev:web      # start Next.js dev server → http://localhost:3000
npm run build:web    # production build
npm run lint:web     # ESLint
npm run typecheck:web  # tsc --noEmit
```

### Backend (`apps/api`)
```bash
cd apps/api
dotnet run           # start API → http://localhost:5000 | Swagger → /swagger
dotnet build         # compile
dotnet test          # run xUnit tests
```

### Environment setup (first time)
```bash
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

---

## Architecture

### Monorepo
npm workspaces (not Turborepo). Two deployable apps share packages via workspace symlinks:
- `apps/web` → Next.js frontend (Vercel)
- `apps/api` → .NET 10 backend (Render)
- `packages/eslint-config` → `@portfolio/eslint-config`
- `packages/tsconfig` → `@portfolio/tsconfig` (`base.json` + `nextjs.json`)
- `content/{en,ar,nl}/` → the "database" — JSON and MDX files, no DB

### Backend — Clean Architecture

Layers and their dependency direction (enforced by `.csproj` project references, not convention):

```
Api → Application → Domain
Infrastructure → Application
```

- `Domain/` — entities, value objects; zero external dependencies
- `Application/` — use cases, repository interfaces (`IContentRepository`), DTOs, query handlers
- `Infrastructure/` — implements interfaces; reads JSON from `content/`; wraps `IMemoryCache`
- `Api/` — Minimal API routes, middleware, DI wiring, Swagger, CORS

`Infrastructure` never references `Api`. `Domain` has no NuGet dependencies.

### Frontend — Next.js App Router

```
apps/web/app/[locale]/     ← all routes under locale segment
apps/web/components/       ← stateless reusable UI atoms (Button, Card, Badge)
apps/web/features/         ← page-level sections (Hero/, ProjectList/) — colocate component + logic
apps/web/services/         ← typed fetch() wrappers; called from Server Components only
apps/web/hooks/            ← client-only hooks; every file is 'use client'
apps/web/lib/              ← pure utility functions; no React/Next imports
apps/web/types/            ← TypeScript interfaces (must mirror C# DTOs in Application/)
```

`components/` = used in more than one place. `features/` = page-specific, not reused.

### Frontend/Backend Communication

Server Components call `services/` → `fetch` the .NET API with `?locale={locale}` query param → typed DTO response.

Two-tier caching:
- .NET `IMemoryCache`: 15-min TTL on JSON file reads
- Next.js `fetch` cache: `revalidate: 3600` (hourly ISR)

### Content

All portfolio data lives in `content/{locale}/{file}.json`. The backend reads these via `JsonContentRepository` in `Infrastructure/`. Locale is passed as a query param (`?locale=en`); the backend reads the matching locale folder. No database. Content updates require a git push and rebuild.

MDX pages (`content/{locale}/pages/*.mdx`) processed by `@next/mdx` via dynamic imports:
```ts
const { default: Page } = await import(`@/content/${locale}/pages/about.mdx`)
```

---

## Key Conventions

**RTL support** — use logical padding (`ps-`, `pe-`) never directional (`pl-`, `pr-`). Root layout sets `dir="rtl"` for Arabic. Tailwind `rtl:` variant enabled.

**DTO sync** — TypeScript interfaces in `apps/web/types/` must be kept in sync with C# DTOs in `Application/` by hand. No codegen yet.

**CORS** — driven by `AllowedOrigins` env var in `apps/api/.env`. Not an architecture concern — standard .NET config.

**Localization** — `next-intl` handles URL routing (`/en`, `/ar`, `/nl`) and UI strings (`messages/{locale}.json`). Portfolio content strings live separately in `content/{locale}/`.

**MediatR** — included for CQRS demonstration value. For 4 read-only endpoints, direct `IContentService` calls would be equally valid.
