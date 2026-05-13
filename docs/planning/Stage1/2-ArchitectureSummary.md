# Stage 1 — Architecture Summary

> Distilled from `Stage1-Architecture.md`. Covers all key dimensions of the planned platform.

---

## Project Goals

- Build a **production-grade personal engineering portfolio platform** — not a simple template.
- Demonstrate senior-level capability across: frontend, backend, architecture, DevOps, accessibility, SEO, and AI integration.
- Structure the platform as a **monorepo** containing a Next.js frontend and a .NET 10 Minimal API backend.
- Use **JSON/MDX file-based content** — no database required for Stage 1.
- Design the architecture to be **AI chatbot integration-ready** from day one (Semantic Kernel / RAG path).

---

## Functional Requirements

| Area | Requirement |
|---|---|
| Localization | Multilingual routing: `/en`, `/ar`, `/nl` |
| RTL | Arabic routes automatically switch to RTL layout |
| Theming | Dark mode default; light mode toggle; respects system preference |
| Content pages | Profile, Projects, Experience, Recommendations |
| Rich pages | MDX-powered pages: `about.mdx`, `ai-workflow.mdx` |
| API | REST endpoints served via .NET 10 Minimal API with Swagger/OpenAPI |
| Health check | `GET /health` endpoint |
| Caching | In-memory caching layer for JSON content reads |
| API versioning | Strategy prepared for future versioning (`/v1/`, header-based, or URL-based) |
| Shared types | Consistent DTO contracts: `ProfileDto`, `ProjectDto`, `ExperienceDto`, `RecommendationDto` |

---

## Non-Functional Requirements

**SEO**
- Next.js Metadata API for per-page metadata
- OpenGraph tags
- `robots.ts` and `sitemap.ts` generation
- Canonical URL strategy

**Accessibility**
- Semantic HTML throughout
- Keyboard navigation support
- ARIA-friendly component structure
- Reduced motion support (`prefers-reduced-motion`)

**Responsive Design**
- Mobile-first layout
- Breakpoints: mobile → tablet → desktop → ultra-wide

**UI / Design**
- Minimalist, engineering-focused design system
- Inspired by: Vercel, Linear, Raycast, Stripe developer docs
- No heavy gradients or flashy effects — focus on spacing, typography, and subtle animation

**Observability**
- Structured logging via Serilog
- Global exception handling middleware

**Code Quality**
- ESLint + Prettier + EditorConfig (required)
- Husky + lint-staged (optional, pre-commit enforcement)

**CI/CD & Deployment**
- GitHub Actions workflow placeholders
- `.env.example` files per app
- Deployment targets: **Vercel** (frontend), **Render / Railway** (backend)
- Docker-ready structure prepared but not required for deployment

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Repo strategy | Monorepo with Turborepo | Unified tooling, shared packages, single CI pipeline |
| Content storage | JSON files (no database) | Simplest approach; version-controlled; sufficient for static portfolio data |
| Content access | Repository Pattern | Abstracts file I/O; swappable for a DB later without changing use cases |
| Backend pattern | Clean Architecture (4-layer) | Enforces separation of concerns; testable; familiar to .NET senior engineers |
| Frontend routing | Next.js App Router | Latest stable; supports layouts, server components, streaming |
| Localization | `next-intl` | First-class App Router support; locale-prefixed URL routing built in |
| Theme | `next-themes` | SSR-safe theme toggling; system preference detection |
| UI components | `shadcn/ui` + Tailwind | Composable primitives; accessible by default; no runtime CSS-in-JS |
| Animation | Framer Motion | Professional-quality subtle animations; `useReducedMotion` support |
| Backend caching | `IMemoryCache` | Zero infrastructure overhead; sufficient for read-heavy static content |
| Validation | FluentValidation | Explicit, testable, and readable validation rules |
| Testing | xUnit | Standard .NET testing framework; good ecosystem |
| Shared types | DTO contracts in `packages/shared-types` | Single source of truth for frontend/backend shape agreement |

---

## Suggested Backend Structure

```
apps/api/
├── src/
│   ├── Api/                  # Entry point: Minimal API routes, middleware, DI wiring
│   ├── Application/          # Use cases, CQRS handlers (MediatR), DTOs, interfaces
│   ├── Domain/               # Entities, value objects, domain logic (no external deps)
│   └── Infrastructure/       # JSON readers, MemoryCache, repository implementations
│
└── tests/
    └── UnitTests/            # xUnit tests targeting Application and Domain layers
```

**Layer responsibilities:**
- `Domain` — pure business logic, no framework dependencies
- `Application` — orchestrates use cases, defines repository interfaces
- `Infrastructure` — implements those interfaces (reads JSON from `/content/`)
- `Api` — wires everything together, exposes HTTP endpoints, handles exceptions

---

## Suggested Frontend Structure

```
apps/web/
├── app/                      # Next.js App Router: pages, layouts, route groups
│   └── [locale]/             # Locale-prefixed routing (/en, /ar, /nl)
├── components/               # Shared UI components (shadcn/ui wrappers, primitives)
├── features/                 # Feature-scoped modules (hero, projects, experience, etc.)
├── hooks/                    # Custom React hooks (useTheme, useLocale, etc.)
├── lib/                      # Utility functions, API client factory
├── services/                 # API service layer (typed fetch wrappers per resource)
├── styles/                   # Global CSS, Tailwind base config
└── types/                    # TypeScript interfaces / shared DTO imports
```

**Content structure:**
```
content/
├── en/
│   ├── profile.json
│   ├── projects.json
│   ├── experience.json
│   ├── recommendations.json
│   └── pages/
│       ├── about.mdx
│       └── ai-workflow.mdx
├── ar/                       # Same structure, Arabic translations
└── nl/                       # Same structure, Dutch translations
```

**Monorepo root:**
```
/
├── apps/web/
├── apps/api/
├── content/
├── packages/
│   ├── shared-types/         # DTO contracts (ProfileDto, ProjectDto, etc.)
│   ├── eslint-config/
│   └── tsconfig/
├── infrastructure/
├── .github/workflows/
├── turbo.json
└── package.json
```

---

## Risks / Assumptions

| Risk / Assumption | Detail |
|---|---|
| **Docker is optional** | Architecture doc questions whether Docker is needed since deployment is Vercel + Render/Railway. Docker-ready structure will be scaffolded but not required. |
| **No database = no dynamic content** | All content is static JSON. Features like contact forms, comments, or live data will require external services (e.g., Resend for email, a headless CMS, or serverless functions). |
| **Turborepo is assumed** | `turbo.json` is conditionally referenced. If Turborepo adds too much overhead, the monorepo can be managed with plain npm workspaces. |
| **Husky/lint-staged are optional** | Pre-commit hooks are not enforced by default. Teams working solo may skip these; CI linting acts as the safety net. |
| **AI integration is future scope** | Stage 1 only prepares the structural foundation (clean boundaries, injectable services). Semantic Kernel / RAG chatbot implementation is a later stage. |
| **Placeholder content only** | No real portfolio data is generated in Stage 1. Realistic engineering-oriented placeholder examples are used to validate structure. |
| **RTL requires layout-level handling** | Arabic locale routing must set `dir="rtl"` at the layout level and Tailwind's `rtl:` variant must be enabled. This must be accounted for in the root layout design. |
