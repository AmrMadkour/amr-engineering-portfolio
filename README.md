# AMR Engineering Portfolio

A production-grade personal engineering platform built to demonstrate senior-level full-stack architecture, clean code practices, DevOps readiness, and AI integration capability.

This is not a simple portfolio template. It is engineered as a scalable, modern monorepo with enterprise-inspired patterns.

---

## Features

- **Multi-locale** — English, Arabic (RTL), and Dutch via `next-intl`
- **Dark / light mode** — system-aware with manual toggle
- **Hero section** — bio, social links, résumé download
- **About section** — animated prose panel
- **Technical Skills** — animated infinite carousel with branded icon badges, grouped by category
- **Projects** — linked to employer roles; personal and company projects shown with attribution
- **Experience timeline** — animated; each role shows its related projects as clickable chips
- **Recommendations carousel** — client testimonials
- **Two-tier caching** — .NET `IMemoryCache` (15 min) + Next.js ISR (1 hr)
- **Clean Architecture backend** — enforced layer boundaries, repository pattern over JSON content

---

## Tech Stack

### Frontend (`apps/web`)
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- next-intl (EN / AR / NL localization + RTL)
- next-themes (dark / light mode)
- Framer Motion
- react-icons + lucide-react

### Backend (`apps/api`)
- .NET 10 Minimal API
- Clean Architecture (Domain / Application / Infrastructure / Api)
- Serilog (structured logging)
- Swagger / OpenAPI
- FluentValidation
- IMemoryCache
- xUnit

### Infrastructure
- npm workspaces monorepo
- GitHub Actions (CI/CD)
- Vercel (frontend hosting)
- Render (backend hosting)

---

## Repository Structure

```
/
├── apps/
│   ├── web/              → Next.js frontend
│   └── api/              → .NET 10 Minimal API
│
├── content/
│   ├── en/               → English content (JSON + MDX)
│   ├── ar/               → Arabic content
│   └── nl/               → Dutch content
│
├── packages/
│   ├── eslint-config/    → Shared ESLint rules
│   └── tsconfig/         → Shared TypeScript configs
│
├── docs/
│   ├── planning/         → Architecture planning documents
│   ├── architecture/     → System diagrams and component docs
│   └── decisions/        → Architecture Decision Records (ADRs)
│
├── infrastructure/       → Deployment configs and runbooks
│
└── .github/
    └── workflows/        → CI/CD pipelines
```

---

## Local Development Setup

### Prerequisites
- Node.js >= 20
- npm >= 10
- .NET 10 SDK

### 1. Clone and install

```bash
git clone https://github.com/AmrMadkour/amr-engineering-portfolio.git
cd amr-engineering-portfolio
npm install
```

### 2. Configure environment variables

```bash
# Frontend
cp apps/web/.env.local.example apps/web/.env.local

# Backend
cp apps/api/.env.example apps/api/.env
```

Edit each file and fill in the values.

### 3. Run the frontend

```bash
npm run dev:web
# → http://localhost:3000
```

### 4. Run the backend

```bash
cd apps/api/src/AmrPortfolio.Api
dotnet run
# → http://localhost:5088
# → API docs (Scalar): http://localhost:5088/scalar/v1
```

### 5. Build, lint, and typecheck (frontend)

```bash
npm run build:web      # production build
npm run lint:web       # ESLint
npm run typecheck:web  # tsc --noEmit
```

### 6. Build and test (backend)

```bash
cd apps/api
dotnet build    # compile entire solution
dotnet test     # run xUnit tests
```

---

## Architecture Summary

The backend follows **Clean Architecture** with enforced layer dependencies:

```
Api → Application → Domain
Infrastructure → Application
```

Portfolio data lives as JSON and MDX files under `content/{locale}/` — no database. The `Infrastructure` layer reads and caches JSON via `IMemoryCache` (15-min TTL). MDX pages are compiled at build time by `@next/mdx`. The frontend fetches API data using Next.js `fetch` with hourly ISR revalidation.

---

## Author

**Amr Madkour** — Senior .NET Engineer

---

## Copyright & Usage

© 2026 Amr Madkour. All Rights Reserved.

This repository is publicly visible for portfolio and demonstration purposes only. No part of this codebase may be copied, modified, redistributed, or used commercially without explicit written permission from the author.
