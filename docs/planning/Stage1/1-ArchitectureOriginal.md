Stage 1 — Architecture Planning & Foundation Setup

IMPORTANT:
Do NOT generate code yet.

First:
- analyze the architecture
- validate the tech stack
- identify risks/tradeoffs
- suggest improvements
- explain folder structure
- explain frontend/backend communication
- explain localization strategy
- explain deployment strategy
- explain content management strategy
- explain CI/CD approach
- explain why each major library was selected

Then provide:
1. recommended final architecture
2. implementation roadmap
3. possible simplifications
4. possible future scalability path

Only after the architecture review is approved should implementation begin.


You are a senior software architect and staff-level full-stack engineer.

Your task is to scaffold and architect a production-grade personal portfolio platform for a Senior .NET Engineer.

The goal is NOT to generate a simple portfolio template.
The goal is to create a scalable, maintainable, modern engineering-focused platform that demonstrates senior-level frontend, backend, architecture, DevOps, accessibility, SEO, and AI-integration capabilities.

====================================================
HIGH LEVEL GOALS
====================================================

Build a monorepo that contains:

1. Frontend:
- Next.js (latest stable App Router)
- TypeScript
- Tailwind CSS
- Dark/light mode support
- RTL/LTR support
- SEO-first architecture
- Accessibility-first architecture
- Mobile-first responsive design
- Modern Vercel/Linear-inspired UI foundation

2. Backend:
- .NET 10 Minimal API
- Clean Architecture
- SOLID principles
- Swagger/OpenAPI
- Structured logging
- In-memory caching
- Unit testing setup
- Repository abstraction
- JSON/MDX-based content source
- No database

3. DevOps:
- GitHub-ready repository structure (i have repo created)
- Environment variable strategy
- CI/CD preparation
- Production-ready configuration
- Docker-ready structure (optional but prepared) (do we need it because we will not deploy to docker )


4. Content Strategy:
- Content stored in version-controlled files
- JSON for structured data
- MDX for rich pages/articles
- Localization-ready content structure

====================================================
MONOREPO STRUCTURE
====================================================

Create a professional monorepo structure similar to enterprise-grade repositories.

Expected structure:

/
├── apps/
│   ├── web/                     -> Next.js frontend
│   └── api/                     -> .NET 10 API
│
├── content/
│   ├── en/
│   ├── ar/
│   └── nl/
│
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
│
├── infrastructure/
│   ├── github/
│   └── docs/
│
├── .github/
│   └── workflows/
│
├── README.md and LICENSE (created)
├── package.json
└── turbo.json (if Turborepo is used)

====================================================
FRONTEND REQUIREMENTS
====================================================

Inside apps/web:

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint 
- Prettier 
- next-intl for localization
- next-themes for dark/light themes
- shadcn/ui
- Framer Motion
- next-seo compatible structure
- next/image optimization
- App Router metadata API

Implement:

1. Folder architecture:
- app/
- components/
- features/
- lib/
- hooks/
- services/
- styles/
- types/

2. Localization-ready routing:
- /en
- /ar
- /nl

3. RTL support:
Arabic routes must automatically switch to RTL.

4. Theme system:
- Dark mode default
- Light mode toggle
- Respect system preference

5. Accessibility foundation:
- Semantic HTML
- Keyboard navigation preparation
- ARIA-friendly structure
- Reduced motion support

6. SEO foundation:
- Metadata API setup
- OpenGraph preparation
- robots.ts
- sitemap.ts
- Canonical URL strategy

7. Responsive layout foundation:
- Mobile-first
- Tablet
- Desktop
- Ultra-wide support

8. Design foundation:
Create a minimalist engineering-focused design system inspired by:
- Vercel
- Linear
- Raycast
- Stripe developer docs

Do NOT create heavy gradients or flashy effects.
Focus on:
- spacing
- typography
- subtle animations
- professional feel

====================================================
BACKEND REQUIREMENTS
====================================================

Inside apps/api:

Use:
- .NET 10 Minimal API
- Clean Architecture
- SOLID principles
- Swagger/OpenAPI
- Serilog
- FluentValidation
- MemoryCache
- xUnit testing setup

Architecture:

apps/api/
├── src/
│   ├── Api/
│   ├── Application/
│   ├── Domain/
│   └── Infrastructure/
│
├── tests/
│   └── UnitTests/

Requirements:

1. Create proper Clean Architecture boundaries.

2. Add dependency injection setup.

3. Add global exception handling middleware.

4. Add health check endpoint.

5. Add Swagger documentation.

6. Add repository abstraction for content loading.

7. Use JSON files as content source.

8. Add in-memory caching layer.

9. Add configuration pattern using Options.

10. Add logging strategy with Serilog.

11. Prepare for future AI integration.

12. Add API versioning strategy preparation.

====================================================
CONTENT ARCHITECTURE
====================================================

Inside /content:

Prepare localization folders:

/content/en
/content/ar
/content/nl

Create sample content structures:

profile.json
projects.json
experience.json
recommendations.json

Also create:
/pages/about.mdx
/pages/ai-workflow.mdx

Example JSON structure should be professional and strongly typed.

====================================================
SHARED TYPES
====================================================

Create shared frontend/backend DTO contracts.

Examples:
- ProfileDto
- ProjectDto
- ExperienceDto
- RecommendationDto

Ensure consistency between frontend and backend.

====================================================
DEVOPS & CI/CD
====================================================

Prepare:
- GitHub Actions workflow placeholders
- Environment variable examples
- .env.example files
- README setup instructions
- Deployment preparation for:
  - Vercel frontend
  - Render/Railway backend

====================================================
CODE QUALITY
====================================================

Configure:
- ESLint
- Prettier
- EditorConfig
- Husky (optional)
- lint-staged (optional)

====================================================
TESTING
====================================================

Prepare:
- xUnit setup for backend
- frontend testing structure placeholder
- architecture for future integration tests

====================================================
IMPORTANT ENGINEERING REQUIREMENTS
====================================================

1. Use clean naming conventions.

2. Avoid overengineering.

3. Keep architecture scalable.

4. Follow modern 2026 engineering standards.

5. Explain WHY architectural decisions are made.

6. Add comments ONLY where useful.

7. Do NOT generate fake portfolio content.
Use placeholder realistic engineering-oriented examples.

8. Structure code so future AI chatbot integration becomes easy.

9. Ensure localization architecture is scalable.

10. Ensure frontend can consume backend APIs cleanly.

====================================================
DELIVERABLES
====================================================

Generate:

1. Full folder structure
2. Initial scaffolded codebase
3. Sample DTOs
4. Sample API endpoints
5. Sample localized content
6. Theme setup
7. Localization setup
8. README documentation 
9. Architecture explanation
10. Setup instructions
11. Future roadmap recommendations

At the end:
Explain:
- architecture decisions
- tradeoffs
- future scalability path
- deployment strategy
- recommended next implementation phase

DO NOT implement the final portfolio UI or BackEnd yet.
Focus ONLY on creating the professional foundation and architecture.
