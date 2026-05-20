# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Permissions:** Before asking the user for approval, check `.claude/settings.local.json` — common dev commands (`npm run *`, `dotnet run *`, `dotnet build *`, `git *`, Playwright MCP tools, and specific PowerShell launch commands) are pre-approved and must be run without prompting.

---

## Project Status

**Phase 1.1 (Monorepo Scaffold) — COMPLETE**
**Phase 1.2 (Backend Foundation) — COMPLETE**
**Phase 1.3 (Frontend Foundation) — COMPLETE**
**Phase 1.4 (Content Scaffold) — COMPLETE**
**Phase 1.5 (CI/CD Scaffold — minimal skeleton) — COMPLETE**
**Phase 2 (UI Implementation) — IN PROGRESS**
- [x] Step 1a: Tailwind v4 → v3 migration (monorepo content scanning fix)
- [x] Step 1b: Navbar redesign (Showoff floating pill, dotted texture, hover labels, avatar placeholder)
- [x] Step 1c: Critical CSS fix — Tailwind preflight missing; manually added `box-sizing: border-box` + `body { margin: 0 }` to `@layer base`; horizontal overflow fixed; scrollbar hidden
- [x] Step 2a: Hero section polish — responsive breakpoints, bio padding, greeting layout, color scheme (violet), LinkedIn hover, double-comma fix
- [x] Step 2b: Home page sections — About, Projects, Experience, Recommendations all implemented; ContactCTA + AIWorkflowTeaser built but not yet wired into home page
- [ ] Step 2c: Wire ContactCTA (and optionally AIWorkflowTeaser) into home page; Technical Skills section
- [ ] Step 3: Projects page
- [ ] Step 4: Experience page
- [ ] Step 5: Contact page

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
cd apps/api/src/AmrPortfolio.Api
dotnet run           # start API → http://localhost:5088 | Scalar docs → /scalar/v1

cd apps/api
dotnet build         # compile entire solution
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

- `Domain/` — placeholder; no entities yet (all data is DTO-shaped JSON, no rich domain model needed at this stage)
- `Application/` — repository interface (`IContentRepository`), DTOs (`ProfileDto`, `ProjectDto`, `ExperienceDto`, `RecommendationDto`)
- `Infrastructure/` — implements interfaces; reads JSON from `content/`; wraps `IMemoryCache`
- `Api/` — Minimal API routes, middleware, DI wiring, Scalar/OpenAPI, CORS

`Infrastructure` never references `Api`. `Domain` has no NuGet dependencies.

### Frontend — Next.js App Router

```
apps/web/app/[locale]/     ← all routes under locale segment
apps/web/components/       ← stateless reusable UI atoms (Button, Card, Badge)
apps/web/features/         ← page-level sections (Hero/, About/, ProjectList/, ExperienceTimeline/, RecommendationsCarousel/, ContactCTA/, AIWorkflowTeaser/) — colocate component + logic
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

MDX pages (`content/{locale}/pages/*.mdx`) processed by `@next/mdx`. `content/` is at the monorepo root; accessed via the `@content/*` tsconfig alias (`../../content/*` relative to `apps/web`).

Use an **explicit locale→import map** — never a template literal dynamic import (breaks Next.js static analysis):
```ts
const mdxPages = {
  en: () => import('@content/en/pages/about.mdx'),
  ar: () => import('@content/ar/pages/about.mdx'),
  nl: () => import('@content/nl/pages/about.mdx'),
}
```

---

## Key Conventions

**RTL support** — use logical padding (`ps-`, `pe-`) never directional (`pl-`, `pr-`). Root layout sets `dir="rtl"` for Arabic. Tailwind `rtl:` variant enabled.

**DTO sync** — TypeScript interfaces in `apps/web/types/` must be kept in sync with C# DTOs in `Application/` by hand. No codegen yet.

**CORS** — driven by `AllowedOrigins` env var in `apps/api/.env`. Not an architecture concern — standard .NET config.

**Localization** — `next-intl` handles URL routing (`/en`, `/ar`, `/nl`) and UI strings (`messages/{locale}.json`). Portfolio content strings live separately in `content/{locale}/`.

**No MediatR** — endpoints inject `IContentRepository` directly. For 4 read-only GET endpoints, MediatR adds overhead without benefit. The interface boundary in `Application/` is the CQRS seam if needed later.
