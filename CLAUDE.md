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
**Phase 2 (UI Implementation) — COMPLETE**
- [x] Step 1a: Tailwind v4 → v3 migration (monorepo content scanning fix)
- [x] Step 1b: Navbar redesign (Showoff floating pill, dotted texture, hover labels, avatar placeholder)
- [x] Step 1c: Critical CSS fix — Tailwind preflight missing; manually added `box-sizing: border-box` + `body { margin: 0 }` to `@layer base`; horizontal overflow fixed; scrollbar hidden
- [x] Step 2a: Hero section polish — responsive breakpoints, bio padding, greeting layout, color scheme (violet), LinkedIn hover, double-comma fix
- [x] Step 2b: Home page sections — Hero, About, TechnicalSkills, ExperiencePreview (3 featured cards), Recommendations. **Design change:** Projects section removed (experience-first restructure); ContactCTA replaced by standalone Contact page; navbar is Home/Experience/Contact only
- [x] Step 2c: Technical Skills section (animated carousel, icon map, react-icons/si + lucide fallbacks); Projects ↔ Experience linking via `experienceId`
- [x] Step 2d (revised): Contact page — standalone `/contact` route with email, LinkedIn, schedule-a-call. ContactCTA not wired to homepage by design.
- [x] Step 3 (revised): No standalone Projects page — replaced by experience-first approach. `/projects` route still exists but is unlinked.
- [x] Step 4: Experience page rebuilt — list cards, client-side filtering (Type/Focus/Era), project counts per entry
- [x] Step 5: Experience detail pages — `/experience/[slug]` dynamic route; company and personal/freelance layouts; embedded projects/use-cases

**Phase 2 Cleanup (pre-Phase 3) — COMPLETE**
- [x] Delete dead files: `ExperienceSection`, `ExperienceCard`, `ExperienceAnimatedList`, `ProjectList/*`, `ContactCTA/`, `AIWorkflowTeaser/`, `/projects` route, `public/icons/aws.svg`
- [x] SEO: `generateMetadata` added to `/experience/[slug]/page.tsx`
- [x] Translate AR/NL experience + project descriptions

**Phase 3 (AI Integration) — COMPLETE**
- [x] `IChatService` + `ErrorEvent`/`ChatErrorCodes` in `Application/`
- [x] `GeminiChatService` in `Infrastructure/AI/` — `gemini-flash-latest` via `Mscc.GenerativeAI`, function calling, SSE streaming, 45s timeout, 1 silent retry on `GeminiApiException`
- [x] `POST /v1/chat` SSE endpoint — locale whitelist validation, streams `delta`/`action`/`error` events
- [x] Context: full portfolio JSON loaded per-request from `IContentRepository` (fits in one context window, no vector DB needed)
- [x] `ChatWidget` frontend — floating FAB, illustrated avatar, quick-action chips (3 direct, 1 AI), i18n error codes, RTL-aware
- [x] `react-markdown` in chat bubbles (`ChatMessage.tsx`)
- [x] Rate limiting on `POST /v1/chat` — `AddRateLimiter` fixed window per IP in `Program.cs`
- [x] Unit tests for `GeminiChatService.ClassifyGeminiError` (`GeminiChatServiceTests.cs`)

**Phase 4 (Deployment & Production) — COMPLETE**
- [x] Dockerfile + Render deploy (`.NET` backend at `https://amr-portfolio-api.onrender.com`)
- [x] Vercel deploy (frontend) + CORS env var `AllowedOrigins`
- [x] Custom domain `amrmadkour.com` via Cloudflare (DNS-only, no proxy — required for Vercel SSL)
- [x] CI/CD — GitHub Actions `ci.yml` (lint/typecheck/build/test) gates `deploy.yml` (Render + Vercel webhooks) on `main` only
- [x] SEO — `generateMetadata` on all routes, JSON-LD `PersonJsonLd`, OG image, `sitemap.ts`, `robots.ts`; `NEXT_PUBLIC_SITE_URL=https://amrmadkour.com` drives all canonical URLs
- [x] Google Search Console — domain property verified; sitemap submitted and accepted
- [x] Branch protection on `main` — PR required; `CI / frontend` + `CI / backend` checks must pass

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

### Gemini API key (required for the AI chat widget)
The key is stored in **.NET User Secrets** — never committed to git.
```bash
cd apps/api/src/AmrPortfolio.Api

# Set (or update) the key — get one at https://aistudio.google.com → Get API key
dotnet user-secrets set "Gemini:ApiKey" "YOUR_KEY_HERE"
dotnet user-secrets set "Gemini:ModelId" "gemini-flash-latest"

# Verify
dotnet user-secrets list
```
**Quota exhausted?** Create a new Google Cloud project and generate a fresh key — quota is per-project, not per-key. See `apps/api/.env.example` for full details and free-tier limits.

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
- `Application/` — `IContentRepository`, `IChatService`, DTOs (`ProfileDto`, `ProjectDto`, `ExperienceDto`, `RecommendationDto`, `ChatRequestDto`, `ChatEventDto` hierarchy with `TextDeltaEvent`/`ActionEvent`/`ErrorEvent`), `ChatErrorCodes` constants
- `Infrastructure/` — `JsonContentRepository` (JSON file reads + `IMemoryCache`), `GeminiChatService` (Gemini 2.0 Flash via `Mscc.GenerativeAI`)
- `Api/` — Minimal API routes, middleware, DI wiring, Scalar/OpenAPI, CORS

`Infrastructure` never references `Api`. `Domain` has no NuGet dependencies.

### Frontend — Next.js App Router

```
apps/web/app/[locale]/     ← all routes under locale segment
apps/web/components/       ← stateless reusable UI atoms (Button, Card, Badge)
apps/web/features/         ← page-level sections — colocate component + logic:
                             Hero/, About/, TechnicalSkills/, ExperiencePreview/ (homepage teaser cards),
                             ExperienceTimeline/ (list cards, filter bar, page client, detail view),
                             RecommendationsCarousel/, Footer/, ChatWidget/
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

Content files per locale: `profile.json`, `projects.json`, `experience.json`, `recommendations.json`, `skills.json`. The `skills.json` file is read directly by the frontend via static import (not via the API) — it is not exposed through `IContentRepository`.

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

**No MediatR** — endpoints inject repository/service interfaces directly. For 4 read-only GET endpoints + 1 POST chat endpoint, MediatR adds overhead without benefit. The interface boundary in `Application/` is the CQRS seam if needed later.

**Project ↔ Experience linking** — `Project` has an optional `experienceId: string | null` field (mirrored in `ProjectDto`). Projects link to `Experience.id`. Related projects surface on the experience detail page (`/experience/[slug]`), not as inline chips. Personal/freelance experiences use `experienceId: "<experience-slug>"` too — the portfolio project links to `"amr-portfolio"`.

**Experience schema** — `Experience` now has `type: "company" | "personal" | "freelance"`, `featured: boolean` (controls which 3 cards appear on the homepage preview), `domain: "backend" | "fullstack" | "cloud" | "frontend" | null` (drives the Focus filter on the experience page), and optional `company`/`role` (null for personal/freelance). All fields are mirrored in the TypeScript type and C# `ExperienceDto`.

**Chat error codes** — `GeminiChatService` never returns human-readable strings. It yields `ErrorEvent(string Code)` with a `ChatErrorCodes` constant. The frontend (`ChatWidget.tsx`) translates codes via `messages/{locale}.json` `ChatWidget.errors.*` keys. Adding a new error type = add a constant + add a translation key; no C# strings to change.

**Slash commands** — `.claude/commands/run.md` (`/run`) starts API + web + verifies Playwright. `.claude/commands/push.md` (`/push`) stages, commits with a descriptive message, and pushes the current branch.

---

## Quality Gate (single source of truth)

A commit is **shippable** when ALL of the following pass. Run `npm run quality:all` locally before pushing to main.

### Frontend (run from `apps/web`)
| Check | Command | Pass condition |
|---|---|---|
| ESLint + sonarjs | `npm run lint:web` | 0 errors |
| TypeScript | `npm run typecheck:web` | 0 errors |
| Duplication | `npm run quality:web:dupes` | ≤ 5% duplicate blocks |
| Tests + coverage | `npm run test:web:coverage` | All pass; lines ≥ 70%, branches ≥ 60% |
| Build | `npm run build:web` | Exit 0 |

### Backend (run from `apps/api`)
| Check | Command | Pass condition |
|---|---|---|
| Code style | `dotnet format --verify-no-changes` | No changes needed |
| Build + analyzers | `dotnet build -c Release` | 0 warnings, 0 errors |
| Tests + coverage | `dotnet test --settings coverage.runsettings` | All pass; lines ≥ 70%, branches ≥ 60% |

**Coverage exclusion note**: `GeminiChatService.StreamResponseAsync` and `BuildSystemPromptAsync` are excluded from the threshold calculation because they require a live Gemini API key to exercise — they cannot be meaningfully unit-tested. All other code is covered.

### Notes
- `dotnet build -c Release` enables SonarAnalyzer and Roslyn analyzers (in `Directory.Build.props`). The Debug build also runs analyzers — 0 warnings enforced by `.editorconfig`.
- The `.editorconfig` at `apps/api/.editorconfig` documents why each suppression exists.
- `npm run quality:all` (root) chains FE + BE gates in sequence (A8).
