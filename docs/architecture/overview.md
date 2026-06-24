# Architecture Overview

> What the system is and why it's shaped this way. Originally written as a pre-implementation
> validation exercise (Stage 1); the project has since reached Phase 4 (production launch) —
> this doc has been updated to reflect what was actually built, not just what was proposed.
> Durable rationale behind individual decisions lives in `decisions/`; day-to-day implementation
> history lives in `git log`.

---

## 1. Architecture Analysis

**Overall verdict: Sound and well-matched for its purpose.**

The combination of Turborepo monorepo + Next.js App Router + .NET 10 Minimal API with Clean Architecture + JSON/MDX file content is a well-calibrated choice for a portfolio that needs to *demonstrate* senior engineering patterns without *requiring* a database or complex infrastructure.

**Why this works:**
- A JSON-file backend with a 4-layer Clean Architecture might seem heavy for 4 read-only endpoints — and in isolation it would be. Here it is justified: it shows extensible design thinking, creates explicit seams where a real DB or AI integration plugs in later, and is exactly the kind of pattern a senior engineer reaches for by default.
- Next.js App Router gives SSR/SSG with zero configuration, which means the portfolio is SEO-optimal without any extra effort.
- The Repository Pattern over JSON files is the right abstraction — the `IContentRepository` interface in `Application/` does not care whether the backing store is a file, a CMS, or a database.

**Implementation note:**

CORS configuration (`AllowedOrigins` env var) is required for cross-origin requests between Vercel and Render. This is standard .NET config — not an architecture decision. Covered in the deployment section.

---

## 2. Tech Stack Validation

### Frontend

| Library | Verdict | Rationale |
|---|---|---|
| Next.js 15 App Router | ✅ Correct | RSC-first; best-in-class SEO; Vercel-native; streaming support |
| TypeScript | ✅ Essential | Type-safe DTO contracts; catches shape mismatches at compile time |
| Tailwind CSS | ✅ Correct | Utility-first; zero runtime; excellent `rtl:` and `dark:` variants |
| shadcn/ui | ✅ Best choice | You own the code; accessible (Radix primitives); fully customizable |
| next-intl | ✅ Gold standard | Built for App Router; locale routing + RSC messages in one package |
| next-themes | ✅ Correct | SSR-safe; no flash of wrong theme; system preference detection |
| Framer Motion | ✅ Correct | `useReducedMotion()` hook; professional-quality animation DX |
| next/font | ⚠️ Missing | Should replace direct Google Fonts CDN imports; better Core Web Vitals |

### Backend

| Library | Verdict | Rationale |
|---|---|---|
| .NET 10 Minimal API | ✅ Correct | Minimal ceremony; excellent performance; modern 2026 .NET |
| Clean Architecture (4-layer) | ✅ Justified | Testable; explicit dependency direction; demonstrates senior patterns |
| Serilog | ✅ Industry standard | Structured JSON logs; multiple sinks (Console, File, Seq) |
| FluentValidation | ✅ Correct | Readable; testable validation classes separate from DTOs |
| IMemoryCache | ✅ Correct | Zero infrastructure; persistent process on Render keeps cache warm |
| xUnit | ✅ Standard | Parallel by default; clean Fact/Theory API |
| MediatR (implied by CQRS) | ⚠️ Optional | Adds dispatch overhead for 4 read-only endpoints — include for demonstration value; acknowledge the tradeoff in code comments |

### Missing from spec (additions required)

Both items resolved in Phase 1.3/1.4:

| Item | Status |
|---|---|
| MDX library (`@next/mdx`) | ✅ Implemented in Phase 1.4 |
| `next/font` | ✅ Implemented in Phase 1.3 (Inter via `next/font/google`) |

---

## 3. Risks / Tradeoffs

| Risk | Severity | Mitigation |
|---|---|---|
| **Manual DTO sync** — TypeScript interfaces and C# DTOs must be kept in sync by hand | MEDIUM | Accept for a personal project; revisit in Stage 2+ if DTO drift becomes a problem |
| **RTL complexity** — direction affects padding, margins, icons, flex direction, and animations | MEDIUM | Set `dir` at root layout; enable Tailwind `rtl:` variant; use `ps-`/`pe-` instead of `pl-`/`pr-` |
| **No dynamic content** — contact forms, comments require external services | LOW (expected) | Document explicitly; use Resend for email or a serverless form handler |
| **Content deploy = code deploy** — any JSON edit requires a push and rebuild | LOW (expected) | Acceptable for a portfolio; ISR can reduce rebuild cost |
| **MediatR for read-only API** — CQRS adds indirection without real benefit here | LOW | Include for demonstration value; comment that direct service calls are equally valid |
| **Turborepo complexity** — tooling overhead for a solo developer | LOW | Can replace with plain npm workspaces without restructuring; Turborepo pays off at Stage 2+ |
| **MemoryCache + serverless** — if backend moves to serverless, cache is lost on cold start | LOW (future) | Not an issue on Render/Railway persistent processes; document the limitation |

---

## 4. Suggested Improvements

1. **CORS config** — `AllowedOrigins` from env var; allow `localhost:3000` in development. This is standard implementation config, not an architecture decision.

2. **Explicitly choose `@next/mdx`** ✅ Done — official Next.js integration; MDX compiled at build time (not runtime); App Router native via `mdx-components.tsx`; locale-keyed loading via an **explicit import map** (not a template literal — webpack cannot statically analyze template literals):
   ```ts
   const mdxPages = {
     en: () => import('@content/en/pages/about.mdx'),
     ar: () => import('@content/ar/pages/about.mdx'),
     nl: () => import('@content/nl/pages/about.mdx'),
   }
   ```
   `@content/*` is a tsconfig alias mapping to `../../content/*` (monorepo root) from `apps/web/`.

3. **Add `next/font`** — one-line replacement for Google Fonts CDN imports; self-hosted; eliminates the external network request and improves CLS/LCP scores.

4. **Add an OpenTelemetry comment** in the Serilog setup — a single `// TODO: add OpenTelemetry exporter here` marks the exact place to add distributed tracing in Stage 3+.

---

## 5. Folder Structure Explanation

### Monorepo root

```
/
├── apps/           → Deployable units. Each app can be deployed independently.
├── content/        → The "database". Version-controlled. Locale-keyed JSON + MDX.
├── packages/       → Shared internal libraries. Not deployed; consumed by apps.
├── infrastructure/ → IaC, GitHub config, deploy docs. Non-code artifacts.
├── .github/        → CI/CD workflow definitions (GitHub requires root placement).
└── package.json    → Root workspace definition (npm workspaces — Turborepo removed).
```

**Why this shape?** The separation of `apps/` (deployable) from `packages/` (shared) from `content/` (data) from `infrastructure/` (ops) makes each concern easy to locate and easy to change independently. Adding a new app (e.g., a docs site) is a new folder in `apps/` — nothing else changes.

### Frontend `apps/web/`

```
apps/web/
├── app/
│   └── [locale]/           ← Locale segment wraps all pages; root layout sets lang + dir
│       ├── layout.tsx       ← Sets <html lang={locale} dir={...}>
│       ├── page.tsx         ← Home page
│       ├── projects/
│       ├── experience/
│       └── about/
├── components/              ← Generic, stateless UI atoms: Button, Badge, Card
├── features/                ← Page-level modules: Hero/, ProjectList/, ExperienceTimeline/
│                              Colocates component + its logic — avoids flat sprawl
├── services/                ← Typed fetch() wrappers; called from Server Components
│                              (no client bundle cost; runs at build/request time)
├── lib/                     ← Pure utility functions; no React, no Next.js imports
├── hooks/                   ← Client-only React hooks; all files marked 'use client'
├── styles/                  ← Global CSS, Tailwind base config
└── types/                   ← TypeScript interfaces; re-exports from shared-types
```

**Why `features/` alongside `components/`?** `components/` holds reusable primitives (things used in more than one place). `features/` holds page-specific sections (Hero, ProjectList) that colocate their own sub-components, hooks, and service calls. This avoids the common failure mode where `components/` becomes a dumping ground for everything.

### Backend `apps/api/`

```
apps/api/
├── src/
│   ├── Api/            ← HTTP surface: routes, middleware, DI wiring, Swagger, CORS
│   ├── Application/    ← Use cases, repository interfaces, DTOs, query handlers
│   ├── Domain/         ← Entities, value objects; zero external dependencies
│   └── Infrastructure/ ← Implements interfaces: reads JSON, caches, serves files
└── tests/
    └── UnitTests/      ← xUnit; targets Application and Domain; no HTTP, no files
```

**Dependency rule (enforced by project references, not convention):**
```
Api → Application → Domain
Infrastructure → Application
```
`Infrastructure` never references `Api`. `Domain` has no external references at all. This rule is the reason Clean Architecture is worth the setup cost — it makes the codebase testable by construction and makes future replacements surgical rather than global.

---

## 6. Frontend/Backend Communication

### Data flow (preferred path: Server Component)

```
Browser request
  → Next.js SSR (Node/Edge)
    → features/Hero/HeroSection.tsx (Server Component — no 'use client')
      → services/profileService.ts
        → fetch("https://api.yourname.com/v1/profile?locale=en", {
            next: { revalidate: 3600 }  // ISR: revalidate hourly
          })
          → .NET API route  GET /v1/profile?locale=en
            → Application: GetProfileQuery handler
              → IProfileRepository.GetAsync("en")
                → Infrastructure: IMemoryCache.TryGetValue("profile:en")
                  → hit: return cached ProfileDto
                  → miss: read /content/en/profile.json → cache 15 min → return
              ← ProfileDto
            ← ProfileDto as JSON (200 OK)
          ← HTTP 200
        ← ProfileDto (TypeScript type via fetch + JSON.parse)
      ← Typed props
    ← Server-rendered HTML (no JS shipped for this component)
  ← HTML response
```

### Two-tier caching

| Layer | Mechanism | TTL | Benefit |
|---|---|---|---|
| .NET Infrastructure | `IMemoryCache` | 15 min | Eliminates repeated JSON file reads per process |
| Next.js fetch | `revalidate: 3600` | 60 min | Eliminates repeated HTTP calls to the API |

Effect: the JSON file is read at most once every 15 minutes. The API is called at most once every 60 minutes per route.

### CORS (config, not architecture)

```
AllowedOrigins (env var):
  Production: https://yourname.com
  Development: http://localhost:3000
```

Standard .NET config — `appsettings.json` + env var override. No design decision involved; handled during Phase 1.2 implementation.

### Locale strategy

Frontend appends `?locale={locale}` to all API requests. Backend reads `content/{locale}/{file}.json`. This is the simplest, most conventional approach — avoids locale-prefixed API routes (`/api/ar/...`) which are unconventional for REST.

---

## 7. Localization Strategy

### URL routing

```
next-intl middleware intercepts all requests:

/             → redirect to /en/
/en/          → English, LTR
/ar/          → Arabic, RTL
/nl/          → Dutch, LTR
/en/projects  → English projects page
/ar/projects  → Arabic projects page (same component, different data + dir)
```

Configuration in `routing.ts`:
```ts
export const routing = defineRouting({
  locales: ['en', 'ar', 'nl'],
  defaultLocale: 'en'
})
```

### Root layout (critical)

```tsx
// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  )
}
```

This single attribute propagates correct directionality to every child element — CSS logical properties, browser scrollbars, form controls — without any additional configuration.

### Two separate translation concerns

| Concern | Mechanism | Location |
|---|---|---|
| UI strings (nav labels, button text, ARIA) | `next-intl` message files | `messages/en.json`, `messages/ar.json`, `messages/nl.json` |
| Portfolio content (bio, project titles, etc.) | Locale-keyed JSON files | `content/en/*.json`, `content/ar/*.json`, `content/nl/*.json` |

These must remain separate. Mixing UI strings and content strings creates a maintenance problem — UI strings are updated by developers, content is updated by the portfolio owner.

### RTL implementation checklist

- Tailwind `rtl:` variant: enable `mode: 'selector'` in `tailwind.config.ts`
- Use `ps-` / `pe-` (padding-start/end) instead of `pl-` / `pr-` throughout
- Flex rows: `flex-row rtl:flex-row-reverse` where row direction matters
- Arrow icons: `rtl:scale-x-[-1]` or SVG `transform="scale(-1,1)"`
- Framer Motion slide animations: make `x` offset locale-aware (positive in LTR, negative in RTL)
- Test every section in `/ar/` before marking RTL done

### Backend

Backend is locale-agnostic. It reads the locale-specific JSON file based on the `?locale=` query parameter. No translation logic lives in the backend — it is purely a typed file server with a caching layer.

---

## 8. Deployment Strategy

### Frontend — Vercel

```
GitHub repo → Vercel project
  Root directory: apps/web  (or use Turborepo preset)
  Framework: Next.js (auto-detected)
  Build command: next build  (or turbo run build --filter=web)

Environment variables:
  NEXT_PUBLIC_API_URL=https://api.yourname.com
  NEXT_PUBLIC_SITE_URL=https://yourname.com

CDN: Vercel Edge Network (automatic)
ISR: configured per-page with revalidate
Image optimization: next/image (automatic on Vercel)
```

### Backend — Render

```
GitHub repo → Render Web Service
  Root directory: apps/api
  Runtime: .NET (native, no Docker)
  Build command: dotnet publish -c Release -o ./publish
  Start command: dotnet ./publish/AmrPortfolio.Api.dll

Health check path: /health (Render polls this; unhealthy = auto-restart)

Environment variables:
  ASPNETCORE_ENVIRONMENT=Production
  ContentPath=/path/to/content  (or read from embedded resources)
  AllowedOrigins=https://yourname.com
  Serilog__MinimumLevel=Information

Auto-deploy: on push to main branch
```

**Why Render over Railway for .NET?** Render has better native .NET support documentation and a more predictable free-tier behavior for persistent web services. Railway is also valid.

### DNS

```
yourname.com        → Vercel (A record or CNAME)
api.yourname.com    → Render (CNAME)
```

### Docker: added for the backend (supersedes the original "removed" call below)

The original Stage 1 plan called for no Docker (see strikethrough rationale further down). In practice, Render's native .NET support didn't line up cleanly with the monorepo layout and the need to bundle `content/` (at the repo root) alongside the API at build time. The backend now deploys to Render as a Docker image — multi-stage build (`sdk:10.0` → `aspnet:10.0`), built from the **monorepo root** as context so `content/` is reachable. See [ADR 0008](decisions/0008-docker-for-backend-deploy.md) for the full rationale and trade-offs. The frontend still deploys natively to Vercel — no Docker involved there.

---

## 9. Content Management Strategy

### Content lifecycle

```
1. Edit content/en/projects.json in VS Code
2. git commit -m "add project: X"
3. git push origin main
4. GitHub Actions CI runs (lint + test)
5. Vercel rebuilds automatically (or ISR revalidates on next request)
6. .NET MemoryCache TTL expires (15 min) → reads new file on next API call
7. New content is live
```

### JSON schema (strictly typed)

All JSON files must match their corresponding DTO exactly. Example:

```jsonc
// content/en/projects.json
[
  {
    "id": "portfolio-platform",
    "slug": "amr-engineering-portfolio",
    "title": "AMR Engineering Portfolio",
    "description": "Production-grade portfolio platform built with Next.js and .NET 10.",
    "tags": ["Next.js", ".NET", "Clean Architecture", "TypeScript"],
    "liveUrl": "https://yourname.com",
    "repoUrl": "https://github.com/yourname/amr-engineering-portfolio",
    "startDate": "2026-01",
    "endDate": null,
    "featured": true
  }
]

// content/en/recommendations.json
[
  {
    "id": "rec-1",
    "authorName": "...",
    "authorTitle": "...",
    "authorCompany": "...",
    "authorAvatarUrl": null,
    "text": "...",
    "relationship": "Managed directly",
    "source": "LinkedIn",
    "date": "2024-03"
  }
]
```

The C# DTOs and TypeScript interfaces must mirror these shapes exactly. Any field added to the JSON must be added to both. `slug` enables future SEO URLs and AI retrieval — do not omit it.

### MDX processing

Library: **`@next/mdx`**

Chosen over `next-mdx-remote` because:
- Official Next.js integration (co-maintained by Vercel); simpler setup
- MDX compiled at build time — better performance, no runtime serialization
- App Router native: global custom component injection via `mdx-components.tsx`
- Locale-keyed loading via an explicit import map (never a template literal — breaks webpack static analysis); `@content/*` tsconfig alias resolves to monorepo root `content/`
- `next-mdx-remote` runtime loading is only needed when MDX is fetched from an external CMS — not applicable here

### Content validation (optional CI step)

A `validate-content.yml` workflow runs AJV JSON schema validation on every PR that modifies `content/**`. Catches missing required fields, wrong types, or malformed dates before merge.

---

## 10. CI/CD Approach

> The workflow sketches below are the original Stage 1 plan. The actual `deploy.yml` differs in one
> important way: it triggers on `workflow_run` of `ci.yml` succeeding on `main`, not a direct `push`
> — see [ADR 0006](decisions/0006-gated-deploy-pipeline.md) for why. `validate-content.yml` was not
> built. Check `.github/workflows/*.yml` for the current, authoritative pipeline definitions.

### Workflow: `ci.yml` — runs on every PR

```yaml
jobs:
  frontend:
    steps:
      - ESLint (apps/web)
      - Prettier check (apps/web)
      - TypeScript typecheck (tsc --noEmit)
      - next build

  backend:
    steps:
      - dotnet format --verify-no-changes
      - dotnet build
      - dotnet test (xUnit)
```

Both jobs run in parallel. PR cannot merge until both pass.

### Workflow: `deploy.yml` — runs on push to `main`

```yaml
jobs:
  deploy-frontend:
    steps:
      - curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}

  deploy-backend:
    steps:
      - curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

Deploy hooks are stored as GitHub Actions secrets. No credentials in code.

### Workflow: `validate-content.yml` — runs on PRs touching `content/**`

```yaml
on:
  pull_request:
    paths: ['content/**']
jobs:
  validate:
    steps:
      - node scripts/validate-content.js
```

### Branch strategy

```
main              ← production; protected; CI required; 1 review required
AmrMadkour-develop ← active development branch (current)
feature/*         ← short-lived; merged to develop; deleted after merge
```

---

## 11. Why Each Major Library Was Selected

| Library | Why chosen | Alternatives considered |
|---|---|---|
| **Next.js 15 App Router** | Server Components = zero JS for static content; best SEO; Vercel-native; RSC streaming | Remix (less ecosystem maturity), Astro (no React state management) |
| **TypeScript** | Type-safe DTO contracts; IDE completions; catches shape mismatches at compile time | — (non-negotiable) |
| **Tailwind CSS** | Utility-first; zero runtime; `rtl:` and `dark:` variants; pairs perfectly with shadcn/ui | CSS Modules (more verbose RTL), styled-components (runtime bundle cost) |
| **shadcn/ui** | You own the code (copied into repo, not a dep); Radix primitives = accessible by default; fully theme-able | MUI (too opinionated/branded), Mantine (heavier), Radix direct (too bare) |
| **next-intl** | Purpose-built for App Router; handles middleware routing, server component messages, and client hooks in one package | next-i18next (Pages Router only), react-i18next (no RSC support) |
| **next-themes** | SSR-safe (no flash of wrong theme on hydration); 3 lines of setup; system preference detection | Manual class toggling (hydration mismatch risk), CSS media query only (no user override) |
| **Framer Motion** | `useReducedMotion()` hook built-in; layout animations; excellent DX; used by Vercel and Linear themselves | CSS transitions (less control over complex sequences), React Spring (steeper API) |
| **.NET 10 Minimal API** | Minimal ceremony; excellent performance; modern; aligns with 2026 .NET standards | ASP.NET MVC (too heavy for 4 endpoints), FastEndpoints (less known, less demo value) |
| **Clean Architecture** | Testable by design; explicit dependency direction enforced by project references; shows senior architectural thinking; extensible to DB/AI without restructuring | Vertical Slice (simpler, but less demonstrable of layered thinking), CRUD MVC (insufficient for demo purposes) |
| **Serilog** | Structured JSON logs; multiple sink ecosystem (Console, File, Seq, Grafana); .NET de facto standard | NLog (aging API), `Microsoft.Extensions.Logging` alone (no structured output) |
| **FluentValidation** | Readable rule syntax; validator classes are independent testable units; separated from DTOs | DataAnnotations (clutters DTOs with attributes), manual validation (error-prone, verbose) |
| **IMemoryCache** | Built into .NET; zero infrastructure dependency; persistent process on Render keeps cache warm between requests | Redis (massive overkill for static JSON), Fusion Cache (unnecessary complexity at this scale) |
| **xUnit** | .NET community standard; parallel test execution by default; clean Fact/Theory API | NUnit (legacy preference in older codebases), MSTest (corporate, verbose) |
| **Turborepo** | Parallel task execution across apps; task dependency graph; remote cache for CI speed | Nx (more complex configuration), plain npm workspaces (no parallel builds, no caching) |

---

## Recommended Final Architecture

### Verdict

**The proposed architecture is approved.** The tech stack is well-chosen, the patterns are appropriate, and the tradeoffs are conscious and documented. Implementation can proceed.

### Confirmed choices (unchanged)

- npm workspaces monorepo (Turborepo removed — 2 apps do not justify the tooling overhead)
- Next.js 15 App Router + next-intl + next-themes + shadcn/ui + Framer Motion + next/font
- .NET 10 Minimal API + Clean Architecture + Serilog + FluentValidation + IMemoryCache + xUnit
- JSON/MDX file-based content via Repository Pattern
- `@next/mdx` for MDX processing
- Vercel (frontend) + Render (backend) deployment

### Additions (not in original spec)

| Addition | Reason |
|---|---|
| `@next/mdx` | Explicit MDX library choice; official; build-time compilation |
| `next/font` | Core Web Vitals improvement; no Google CDN request |
| CORS `AllowedOrigins` env var | Standard implementation config; not architecture |
| OpenTelemetry TODO comment | One-line marker for future tracing in Stage 3+ |

### Removals (at the time of the original Stage 1 review)

| Removal | Reason | Current status |
|---|---|---|
| Docker | No deployment value for Vercel + Render; adds maintenance overhead | **Reversed** — backend now deploys to Render via Docker; see [ADR 0008](decisions/0008-docker-for-backend-deploy.md) |
| `packages/shared-types` in Stage 1 | Defer to Stage 2; types live in `apps/web/types/` initially; promote to shared package when a second consumer exists | Still deferred — no second consumer has emerged |

---

## Implementation Roadmap

### Phase 1.1 — Monorepo Scaffold ✅ COMPLETE
- [x] Root `package.json` with npm workspaces (`apps/*`, `packages/*`)
- [x] Create `packages/eslint-config` and `packages/tsconfig` shared packages
- [x] Create `apps/web/` and `apps/api/` placeholder directories
- [x] Create `content/en/`, `content/ar/`, `content/nl/` folder structure
- [x] Create `docs/architecture/` and `docs/decisions/` for future ADRs
- [x] Create `infrastructure/` folder
- [x] Add root `.editorconfig`, update `.gitignore`
- [x] Create `apps/web/.env.local.example` and `apps/api/.env.example`

### Phase 1.2 — Backend Foundation ✅ COMPLETE
- [x] Scaffold Clean Architecture solution (`dotnet new sln`)
- [x] Configure Serilog + Scalar/OpenAPI + IMemoryCache + CORS (`AllowedOrigins` env var)
- [x] Implement `IContentRepository` interface in `Application/`
- [x] Implement `JsonContentRepository` in `Infrastructure/`
- [x] Add endpoint groups: `ProfileEndpoints`, `ProjectsEndpoints`, `ExperienceEndpoints`, `RecommendationsEndpoints`
- [x] Add `GET /health` endpoint
- [x] Add xUnit test project with 4 contract tests (NSubstitute); all passing

### Phase 1.3 — Frontend Foundation ✅ COMPLETE
- [x] Create Next.js 15 app with App Router
- [x] Configure `next-intl` middleware and `routing.ts` for `en`, `ar`, `nl`
- [x] Configure `next-themes` provider
- [x] Install and configure `shadcn/ui` (init + Button, Card, Badge)
- [x] Configure Tailwind with `rtl:` variant (`mode: 'selector'`)
- [x] Build root layout: `<html lang={locale} dir={...}>`
- [x] Add `robots.ts` and `sitemap.ts`
- [x] Add `next/font` configuration

### Phase 1.4 — Content Scaffold ✅ COMPLETE
- [x] Add `slug: string` to `ProjectDto`, `ExperienceDto` (C#) and matching TS types
- [x] Add `relationship: string?` and `source: string?` to `RecommendationDto` (C#) and matching TS type
- [x] Install `@next/mdx` + `@types/mdx` in `apps/web`
- [x] Wire `withMDX()` in `apps/web/next.config.ts` (composed with existing `withNextIntl`)
- [x] Create minimal `apps/web/mdx-components.tsx` (headings, links, code, paragraphs only)
- [x] Populate `content/en/` with real data: `profile.json`, `projects.json`, `experience.json`, `recommendations.json`
- [x] Create `content/ar/` and `content/nl/` stubs (same schema, English values, marked for human translation)
- [x] Write `content/en/pages/about.mdx` and `content/en/pages/ai-workflow.mdx`
- [x] Write AR and NL MDX stubs for each page
- [x] Add `apps/web/app/[locale]/about/page.tsx` with explicit locale→MDX import map

### Phase 1.5 — CI/CD Scaffold ✅ COMPLETE (minimal)
- [x] Add `.github/workflows/ci.yml` — skeleton with TODO comments; no live runners yet
- [x] Add `.github/workflows/deploy.yml` — skeleton with TODO comments
- [x] Update `README.md` with local dev setup instructions
- [ ] Full CI/CD pipelines wired (actual jobs) — deferred to Phase 2 after local dev validated

### Phase 2 — UI Implementation ✅ COMPLETE
What shipped differs from the original plan in one significant way: the standalone Projects grid
was dropped in favor of an **experience-first** design (projects surface only inside experience
detail pages) — see [ADR 0002](decisions/0002-experience-first-no-projects-page.md). Otherwise
delivered as planned: Hero, About (animated), Technical Skills carousel, Experience list +
filtering (Type/Focus/Era) + detail pages, Recommendations grid, standalone Contact page.

### Phase 3 — AI Integration ✅ COMPLETE
Built on **Google Gemini** instead of the originally planned Semantic Kernel + OpenAI — see
[ADR 0004](decisions/0004-gemini-over-semantic-kernel.md). No RAG/vector store: the full portfolio
JSON fits in one context window and is rebuilt per-request from the cached `IContentRepository` —
see [ADR 0005](decisions/0005-no-vector-db-full-context.md). Delivered: `IChatService` +
`GeminiChatService` with function calling (navigate, open booking/LinkedIn/GitHub, download resume),
`POST /v1/chat` SSE endpoint with locale validation and rate limiting, error events as codes rather
than strings ([ADR 0007](decisions/0007-sse-error-codes-not-strings.md)), and a floating `ChatWidget`
on the frontend with `react-markdown` rendering and i18n-translated error messages.

### Phase 4 — Production Polish & Deployment ✅ COMPLETE
- **Quality gate**: frontend Vitest + coverage thresholds + SonarJS + jscpd duplication detection;
  backend xUnit + Coverlet coverage + SonarAnalyzer with `TreatWarningsAsErrors`; both wired into a
  real `ci.yml` that gates merges to `main` (branch protection requires the checks to pass).
- **Deployment**: backend on Render via Docker ([ADR 0008](decisions/0008-docker-for-backend-deploy.md));
  frontend on Vercel natively. `deploy.yml` fires only after CI is green
  ([ADR 0006](decisions/0006-gated-deploy-pipeline.md)).
- **Custom domain**: `amrmadkour.com` via Cloudflare, DNS-only — see
  [ADR 0009](decisions/0009-custom-domain-cloudflare-dns-only.md).
- **SEO**: `generateMetadata` on all routes, JSON-LD `Person`, OG image, full sitemap with
  per-locale experience detail pages; Google Search Console verified and sitemap submitted.

---

## Possible Simplifications

| Simplification | Trade-off | Recommendation |
|---|---|---|
| **npm workspaces over Turborepo** | No parallel build graph or remote cache; simpler setup for 2 apps | **Applied.** Turborepo can be added later without restructuring if CI becomes slow. |
| **Skip MediatR → direct `IContentService`** | Less CQRS ceremony; still Clean Architecture; equally correct for 4 GET endpoints | Recommended if shipping speed matters more than CQRS demonstration. Keep MediatR if pattern demonstration is the priority. |
| **Skip Husky + lint-staged** | Pre-commit hooks not enforced; rely on CI | Correct choice for solo work. CI lint job is the safety net. |
| **Skip Docker** | No local-Docker parity; no deployment benefit for Vercel + Render | **Reversed** — Docker was added for the backend deploy. See [ADR 0008](decisions/0008-docker-for-backend-deploy.md). |
| **Defer `packages/shared-types`** | TypeScript types live in `apps/web/types/` until a second consumer exists | Already in recommended plan. Apply immediately. |

---

## Future Scalability Path

**AI chatbot and API rate limiting are already implemented** (not future triggers anymore — see
Phase 3/4 above): `IChatService` + `GeminiChatService` (not Semantic Kernel) with `POST /v1/chat`
(not `/api/chat`), and fixed-window per-IP rate limiting via `AddRateLimiter` in `Program.cs`.
Branch protection on `main` is also already enforced. Remaining open triggers:

| Trigger | Upgrade path | Scope of change |
|---|---|---|
| **Content too large for JSON** | Swap `JsonContentRepository` → `SanityContentRepository` in `Infrastructure/` | Infrastructure only; Application and Domain unchanged |
| **Database needed** | Add EF Core to `Infrastructure/`; implement `IRepository<T>` with DB backing | Infrastructure only; Application uses same interfaces |
| **Cache pressure** | Swap `IMemoryCache` → `IDistributedCache` (Redis) | Infrastructure only; interface already exists in .NET |
| **Frontend grows** | Promote `apps/web/components/` → `packages/ui` | New package; update import paths |
| **CI is slow** | Add Turborepo (`turbo.json` + `turbo run` scripts); enable Remote Cache | No restructuring needed — npm workspaces is compatible |
| **Observability needed** | Add OpenTelemetry exporter to Serilog; ship to Seq or Grafana Cloud | One package + one config line (prep comment already in plan) |
| **More contributors join** | Enable Husky + lint-staged for local pre-commit enforcement | Config only — CI already gates merges |
| **Blog needed** | Add `content/en/posts/` with MDX; add `/blog/[slug]` route | New content type + new route; existing architecture unchanged |
