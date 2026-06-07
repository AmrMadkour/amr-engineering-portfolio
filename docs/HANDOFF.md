# Handoff Log

> Do not duplicate what's in CLAUDE.md. This file captures session history, surprises, and next steps only.

---

## Session — 2026-05-23

### Files changed

**Content (all 3 locales — en/ar/nl)**
- `content/{locale}/experience.json` — added `type`, `featured` fields; new `amr-portfolio` personal experience entry
- `content/{locale}/projects.json` — portfolio project `experienceId` changed from `null` → `"amr-portfolio"`

**Types + DTO**
- `apps/web/types/experience.ts` — added `type`, `featured`; `company`/`role` now `string | null`
- `apps/api/src/AmrPortfolio.Application/DTOs/ExperienceDto.cs` — same additions, nullable Company/Role

**Navbar**
- `apps/web/components/layout/Navbar.tsx` — removed Projects item; nav is now Home / Experience / Contact

**Homepage**
- `apps/web/app/[locale]/page.tsx` — removed ProjectsSection, kept SkillsSection, added ExperiencePreviewSection

**New feature files**
- `apps/web/features/ExperiencePreview/ExperienceTeaserCard.tsx`
- `apps/web/features/ExperiencePreview/ExperiencePreviewSection.tsx`
- `apps/web/features/ExperienceTimeline/ExperienceListCard.tsx`
- `apps/web/features/ExperienceTimeline/ExperienceFilterBar.tsx`
- `apps/web/features/ExperienceTimeline/ExperiencePageClient.tsx`
- `apps/web/features/ExperienceTimeline/ExperienceDetailView.tsx`

**New/rebuilt routes**
- `apps/web/app/[locale]/experience/page.tsx` — rebuilt with filter bar + list cards
- `apps/web/app/[locale]/experience/[slug]/page.tsx` — new dynamic detail route
- `apps/web/app/[locale]/contact/page.tsx` — new

**Docs**
- `CLAUDE.md` — phase checklist + conventions updated

### Decisions

- **Experience-first architecture**: standalone Projects page dropped; projects now surface only inside experience detail pages. Decision driven by 95% of projects belonging to a specific job.
- **Personal projects as Experience entries**: type `"personal"` (or `"freelance"`) with `company: null`, `role: null`. Same detail page layout, different header rendering.
- **`featured` moved to Experience**: the 3 homepage preview cards are controlled by `Experience.featured`, not `Project.featured`.
- **Two card variants by design**: `ExperienceTeaserCard` (homepage — visual, draw-in) and `ExperienceListCard` (experience page — scannable, reference-style) are separate components intentionally.
- **Contact page**: standalone page, no CTA section on homepage. Contact info + schedule-a-call only (no email form).

---

## Session — 2026-05-25

### Files changed

- `apps/web/app/globals.css` — hero entrance animation (`@keyframes hero-enter`, staggered classes per element); scroll-reveal CSS (`.s-reveal` / `.s-reveal--in`); recommendation card CSS (replaced carousel CSS); footer CSS (`.footer-*`); removed `scroll-behavior: smooth`; moved scrollbar-hiding outside `@layer`
- `apps/web/app/[locale]/layout.tsx` — added `FooterSection`; removed `overflow-x: hidden` inline styles from `<html>` and `<body>`
- `apps/web/app/[locale]/page.tsx` — wrapped `AboutSection` and `SkillsSection` in `SectionReveal`
- `apps/web/components/layout/SectionReveal.tsx` — new component (CSS + IntersectionObserver, no framer-motion); added `className` prop
- `apps/web/features/ExperiencePreview/ExperiencePreviewSection.tsx` — header and each card wrapped in `SectionReveal` with stagger
- `apps/web/features/RecommendationsCarousel/RecommendationsSection.tsx` — replaced carousel with grid; header in `SectionReveal`
- `apps/web/features/RecommendationsCarousel/RecommendationsGrid.tsx` — NEW; each card in its own `SectionReveal` with 0.15s stagger
- `apps/web/features/Footer/FooterSection.tsx` — NEW; async Server Component, fetches profile, renders dark footer
- `content/en/recommendations.json` — added 2 placeholder entries (total 3)

### Decisions

- **framer-motion removed from SectionReveal**: 9 synchronous `IntersectionObserver`s during hydration blocked scroll for ~2s. Replaced with a single CSS class toggle per observer. Only `AboutAnimated` still uses framer-motion (isolated, not the cause).
- **`overflow-x: hidden` on `<html>` removed**: Chrome forces main-thread scroll path when root element has `overflow-x: hidden`, blocking compositor scroll during React hydration. Kept `overflow-x: hidden` only on `.page-body`.
- **Recommendations redesign**: old carousel replaced with 3-column card grid. Quote icon (lucide `Quote`) replaces `"` text. Cards are dynamic — works for any count via CSS grid.
- **Footer uses `GitHubIcon` / `LinkedInIcon` from `@/components/ui/icons`**: lucide-react's installed version does not export `Linkedin` or `Github`. Custom SVG components already existed in the codebase.

---

## Session — 2026-05-28

### Files changed

- `apps/web/features/Footer/FooterSection.tsx` — full redesign: passion text, Quick Links col, merged social icons col, legal links bar; now uses `SmartLink` for all internal links
- `apps/web/messages/{en,ar,nl}.json` — added `Footer.passion`, `quickLinks`, `connect`, `allRightsReserved`, `privacyPolicy`, `sitemap` keys
- `apps/web/app/globals.css` — footer passion/bottom CSS; `page-enter` keyframe; `.page-transition-enter`, `.page-head`, `.page-subhead` classes; removed LinkedIn-specific hover override from `.hero-social-btn`
- `apps/web/components/layout/PageTransition.tsx` — NEW; wraps `{children}` with `key={pathname}` + calls `smoothScrollTop()` on every route change
- `apps/web/components/layout/Navbar.tsx` — logo + all nav icon/mobile links: `scroll={false}` + same-page smooth-scroll-to-top via `smoothScrollTop()`
- `apps/web/components/ui/SmartLink.tsx` — NEW client component; same-page → `smoothScrollTop()`, cross-page → `scroll={false}` Link
- `apps/web/lib/smoothScrollTop.ts` — NEW 700ms ease-out-quart RAF scroll utility
- `apps/web/app/[locale]/layout.tsx` — wraps `{children}` with `<PageTransition>`
- `apps/web/app/[locale]/experience/page.tsx` — `page-head`/`page-subhead` on h1/subtitle
- `apps/web/app/[locale]/contact/page.tsx` — same + `SectionReveal` on each card; added `SectionReveal` import
- `apps/web/app/[locale]/privacy-policy/page.tsx` — NEW placeholder page
- `apps/web/app/[locale]/sitemap/page.tsx` — NEW page with locale-aware links + `SectionReveal`
- `apps/web/features/ExperienceTimeline/ExperiencePageClient.tsx` — each card wrapped in `SectionReveal` with staggered delay
- `apps/web/features/ExperienceTimeline/ExperienceDetailView.tsx` — each section wrapped in `SectionReveal`; added `SmartLink` import
- `apps/web/services/api.ts` — `revalidate: 0` in dev, `3600` in prod
- `content/en/experience.json` — added 4 entries: `dotnet-engineer-fintech`, `junior-developer-enterprise`, `freelance-api-consulting`, `ai-code-review-tool`
- `content/{ar,nl}/experience.json` — same 4 entries with TODO translation placeholders

### Decisions

- **`scroll={false}` on all internal Links** — Next.js auto-resets scroll to 0 before React effects run, killing the smooth-scroll animation. `scroll={false}` preserves scroll position so `PageTransition.useEffect` → `smoothScrollTop()` runs from actual position.
- **`SmartLink` for footer** — Footer is a Server Component; can't add `usePathname` or click handlers directly. `SmartLink` is a leaf client component that handles both same-page (scroll only) and cross-page (scroll={false} nav) cases.
- **Custom RAF scroll instead of `behavior: 'smooth'`** — Native smooth scroll is too fast/inconsistent across browsers. 700ms ease-out-quart gives a visible, controlled animation matching the site's existing easing.
- **`revalidate: 0` in dev** — content JSON changes were invisible until server restart; dev mode now always fetches fresh from the API.

---

## Session — 2026-05-28 (content fill)

### Files changed

**English content (source of truth)**
- `content/en/experience.json` — complete replacement: 7 real entries from resume (Metrixlab Senior, Metrixlab Developer, ICT Group N.V., Talabat, Nahdet Misr, Smart Innovation, amr-portfolio). All fictional placeholders removed.
- `content/en/projects.json` — complete replacement: 8 real projects linked to real experience IDs (TIQM Modernization, AdReview Flow, Dashboard Platform, Consumer Event Platform, Meditop Medical, HoloLens Mixed Reality POC, Talabat Integration, AMR Portfolio).
- `content/en/profile.json` — bio rewritten from resume; `resumeUrl` → `/amr-madkour-resume.pdf`; `title` → `Senior Software Developer`; skills array expanded.
- `content/en/skills.json` — restructured from 5 to 7 categories matching resume: Backend Development, Frontend Development, Databases, Cloud & DevOps, Architecture & Practices, Tools & Collaboration, AI & Developer Productivity.
- `apps/web/messages/en.json` — Hero `credentialLabel` + `subtext` updated; About `sectionSubtitle` + `p1`/`p2`/`p3` rewritten to reflect real background.

**Arabic & Dutch translations**
- `content/ar/experience.json`, `content/ar/projects.json`, `content/ar/profile.json`, `content/ar/skills.json` — full translations of all EN content above.
- `content/nl/experience.json`, `content/nl/projects.json`, `content/nl/profile.json`, `content/nl/skills.json` — full Dutch translations.
- `apps/web/messages/ar.json`, `apps/web/messages/nl.json` — Hero + About sections updated to match EN.

**Static asset**
- `apps/web/public/amr-madkour-resume.pdf` — resume PDF added; `profile.json` `resumeUrl` updated to point to it.

### Decisions

- **All fictional experience/project data removed** — prior placeholder entries (FinTech Scale-up, logistics SaaS, etc.) replaced entirely. IDs/slugs now match real companies (e.g. `metrixlab-senior`, `ict-group`, `talabat`).
- **`featured: true` set on metrixlab-senior, metrixlab-developer, amr-portfolio** — these are the 3 homepage preview cards; most recent + most impressive.
- **Project descriptions are 3–4 sentences** — written to cover: what the system did, the technical approach, the specific contribution, and outcome. Structured for the detail page's "Projects & Use Cases" section.
- **Skill category IDs changed** — old `"devops"` and `"quality"` IDs replaced with `"cloud-devops"`, `"architecture"`, `"tools"`, `"ai-productivity"`. Any code referencing old IDs by string would need updating (none found — IDs are data-only).

---

## Session — 2026-05-28 (contact page enhancements)

### Files changed

- `apps/web/app/[locale]/contact/page.tsx` — full redesign: 5 contact cards (added GitHub + Location), fixed cal.com URL, two-column grid layout (cards left, photo right), photo height locked to match cards column via `items-stretch` + `lg:h-full`
- `apps/web/public/amr-madkour.jpg` — user's photo added (447×515px portrait)
- `apps/web/messages/{en,ar,nl}.json` — added `Contact.ctaGitHub` and `Contact.ctaLocation` keys

### Decisions

- **cal.com URL fixed**: contact page had `cal.com/amrmadkour` (no duration); corrected to `cal.com/amr-madkour/30min` matching Hero and ContactCTA.
- **Two-column layout**: photo moved from below-cards standalone banner to right column of a `lg:grid-cols-2` grid. On mobile stacks vertically (cards → photo). Photo column uses `items-stretch` + `lg:h-full` + `lg:aspect-auto` so its height exactly matches the cards column on desktop.
- **Image sizing**: `max-w-sm` → `max-w-md` (448px, ~1:1 with 447px source) to avoid upscaling. `quality={95}`. On mobile: `aspect-[447/515]` preserved; desktop: `aspect-auto lg:h-full` fills grid row height.
- **Profile data fetched in contact page**: page now calls `getProfile(locale)` (same service as HeroSection) to populate name + title in the photo overlay.

---

## Gotchas

- **lucide-react missing icons**: `Github` and `Linkedin` do not exist in the installed version. Use custom SVGs from `@/components/ui/icons` (`GitHubIcon`, `LinkedInIcon`) for brand icons. Check with `node -e "const l = require('./node_modules/lucide-react'); console.log(typeof l.IconName)"` before adding new icons.
- **Old components still on disk**: `ExperienceSection`, `ExperienceCard`, `ExperienceAnimatedList`, `ProjectList/*` all still exist but are no longer wired to any active page. Safe to delete once confirmed, but left in place this session.
- **`/projects` route still exists** at `app/[locale]/projects/page.tsx` — unlinked from navbar but not deleted. Redirect or remove when ready.
- **`SectionReveal` with Playwright**: IntersectionObserver doesn't fire reliably in Playwright's headless browser. Force-reveal hidden elements via `document.querySelectorAll('.s-reveal').forEach(el => el.classList.add('s-reveal--in'))` to screenshot them. Real browsers work fine.
- **Contact page photo**: source is 447×515px — going wider than `max-w-md` (448px) will upscale and degrade quality. Do not increase beyond that unless a higher-res photo is provided.
- **AR/NL experience.json** — all TODO placeholders are now resolved; full translations written this session.
- **Skill category IDs changed** — `"devops"` → `"cloud-devops"`, `"quality"` removed, new `"architecture"` / `"tools"` / `"ai-productivity"` added. If any component filters by category ID string, update accordingly (none found currently).

---

---

## Session — 2026-05-29

### Files changed

- `apps/web/app/globals.css` — navbar scrolled opacity reduced (dark: 0.08→0.25, light: 0.10→0.28); default blur 20px→12px; scrolled blur 14px→3px (content now clearly readable through glass); transition 0.3s→0.15s; added `.hero-avatar-img` CSS (`object-fit: cover; object-position: center`)
- `apps/web/features/Hero/HeroSection.tsx` — replaced `<span>AM</span>` initials with real photo via `next/image` (`/amr-madkour-2.jpg`, 280×280)
- `content/{en,nl}/profile.json` — `title`: "Senior Software Developer" → "Senior Software Engineer"
- `content/ar/profile.json` — `title`: "مطور برمجيات أول" → "مهندس برمجيات أول"
- `apps/web/messages/{en,ar,nl}.json` — `Hero.subtext` replaced with 3-sentence bio (no years, no domains, ends on AI angle)

### Decisions

- **Navbar glass opacity tuned twice**: first pass (blur 14px) made content under navbar unreadable. Second pass dropped blur to 3px — content shows through crisply while tint still separates the bar.
- **Hero photo cropping**: `object-position: center top` cropped off face; changed to `center` to show full face in the circle.

---

---

## Session — 2026-06-01

### Files changed

- `apps/web/features/ExperienceTimeline/ExperienceListCard.tsx` — added `toCompleteSentences()` helper; removed `line-clamp-3`; skills 5→8; added `mt-4` gap between description and skills
- `apps/web/features/ExperiencePreview/ExperienceTeaserCard.tsx` — same `toCompleteSentences()` pattern; skills 4→8; removed `line-clamp-4`; `mb-5`→`mt-6` on skills row; `line-clamp-3`→`line-clamp-4` (then removed entirely)
- `apps/web/features/Footer/FooterSection.tsx` — replaced initials `<div>` with `<Image src="/amr-madkour-2.jpg">` (same photo as Hero); removed `getInitials()` function; added `next/image` import
- `apps/web/public/avatars/wendy-boonstra.jpg` — new
- `apps/web/public/avatars/moinudeen-rahmathulla.jpg` — new
- `apps/web/public/avatars/mostafa-metwally.jpg` — new
- `content/{en,ar,nl}/recommendations.json` — replaced all placeholders with 3 real LinkedIn recommendations (Wendy Boonstra / Toluna, Moinudeen Rahmathulla / MetrixLab, Mostafa Metwally / Smart Innovation Technology)
- `content/en/experience.json` — all 7 descriptions rewritten: direct tone, no AI patterns, 2 complete sentences each ending with a period

### Decisions

- **`toCompleteSentences()` added to both card types**: splits on `. ` boundary so descriptions always end at a sentence boundary — never with a CSS `…` mid-word cutoff. 2-sentence max keeps cards scannable.
- **Footer photo**: reused `/amr-madkour-2.jpg` (same as Hero) to keep a consistent face across the page. `footer-avatar` CSS class already handles size (88×88) and circular border — no CSS changes needed.
- **Recommendation avatars in `public/avatars/`**: kept separate from `public/` root to avoid clutter as more photos are added.
- **Mostafa's company**: corrected to "Smart Innovation Technology" (was incorrectly set to MetrixLab).

### Gotchas

- **API content cache**: the .NET `IMemoryCache` (15-min TTL) means edited JSON files are invisible until the dotnet process restarts. Kill via `netstat -ano | Select-String ":5088"` to get PID, then `Stop-Process`. Use `$apiPid` — `$PID` is read-only in PowerShell and will throw.
- **AR/NL experience descriptions**: still EN text in all 3 locale files. Only `content/en/experience.json` was rewritten this session. Translations pending.

---

---

## Session — 2026-06-02

### Files changed

- `content/en/skills.json` — replaced "AWS Lambda" + "API Gateway" with single "AWS Serverless" skill
- `apps/web/features/TechnicalSkills/SkillIcon.tsx` — removed `aws lambda`/`api gateway` entries; added `aws serverless` → `/icons/aws-serverless.svg`
- `apps/web/public/icons/aws-serverless.svg` — official AWS Lambda λ icon (white on orange, from Simple Icons)
- `apps/web/public/icons/aws.svg` — Amazon brand wordmark SVG (committed but **not used** in any icon map; safe to delete)
- `apps/web/features/ExperienceTimeline/ExperienceFilterBar.tsx` — replaced Tech/Stack + Year filters with Focus (domain) + Era filters
- `apps/web/features/ExperienceTimeline/ExperiencePageClient.tsx` — removed `KEY_TECHS`; added `getEra()` helper; filter state `tech/year` → `domain/era`
- `apps/api/src/AmrPortfolio.Application/DTOs/ExperienceDto.cs` — added `string? Domain` parameter
- `apps/web/types/experience.ts` — added `domain: string | null`
- `content/{en,ar,nl}/experience.json` — added `"domain"` field to every entry (backend/fullstack)
- `apps/web/features/ExperienceTimeline/ExperienceDetailView.tsx` — removed `line-clamp-2` from project description paragraph
- `content/en/experience.json` + `content/en/projects.json` — removed all em-dashes (—) from prose; replaced with commas, colons, or restructured sentences
- `apps/web/next.config.ts` — added `images: { qualities: [75, 85, 90, 95, 100] }` to silence Next.js 16 warning

### Decisions

- **Focus filter (domain) over Tech filter**: per-technology filtering was not meaningful since the same stack spans unrelated roles. Domain (Backend / Full-Stack) maps to actual specialization areas. `domain` is a new explicit field in JSON rather than derived from techs — keeps it stable and overridable.
- **Era filter over Year filter**: fixed three buckets (Early Career ≤2019 / Mid Career ≤2022 / Recent ≥2023) never grow, unlike individual year pills which would accumulate with each new entry.
- **AWS Serverless icon**: used the AWS Lambda λ icon from Simple Icons — represents serverless compute specifically, not the Amazon marketing brand logo. Stored as SVG in `/public/icons/` (same pattern as azure-devops, visual-studio).

---

## Gotchas

- **lucide-react missing icons**: `Github` and `Linkedin` do not exist in the installed version. Use custom SVGs from `@/components/ui/icons` (`GitHubIcon`, `LinkedInIcon`) for brand icons. Check with `node -e "const l = require('./node_modules/lucide-react'); console.log(typeof l.IconName)"` before adding new icons.
- **Old components still on disk**: `ExperienceSection`, `ExperienceCard`, `ExperienceAnimatedList`, `ProjectList/*` all still exist but are no longer wired to any active page. Safe to delete once confirmed, but left in place this session.
- **`/projects` route still exists** at `app/[locale]/projects/page.tsx` — unlinked from navbar but not deleted. Redirect or remove when ready.
- **`SectionReveal` with Playwright**: IntersectionObserver doesn't fire reliably in Playwright's headless browser. Force-reveal hidden elements via `document.querySelectorAll('.s-reveal').forEach(el => el.classList.add('s-reveal--in'))` to screenshot them. Real browsers work fine.
- **Contact page photo**: source is 447×515px — going wider than `max-w-md` (448px) will upscale and degrade quality. Do not increase beyond that unless a higher-res photo is provided.
- **API content cache**: .NET `IMemoryCache` (15-min TTL) means edited JSON files are invisible until the dotnet process restarts. Kill via `Get-NetTCPConnection -LocalPort 5088 -State Listen` to get PID, then `Stop-Process`.
- **`aws.svg` in `/public/icons/`** — committed but unused. The icon map uses `aws-serverless.svg`. Can be deleted.
- **`domain` field in AR/NL experience.json**: values are English strings (`"backend"`, `"fullstack"`) intentionally — they are filter keys, not display labels. Display labels live in `ExperienceFilterBar.tsx` (`DOMAIN_LABELS`).

---

## Session — 2026-06-03 (Phase 3 — "Ask Amr" AI Agent)

### Overview

Added a floating AI agent widget to the portfolio. This is **not just a chatbot** — it is a tool-using agent built on Google Gemini 2.0 Flash (function calling). The agent answers questions about Amr AND takes real actions: navigating pages, opening Cal.com booking, LinkedIn, GitHub, and downloading the resume. It auto-detects English/Arabic/Dutch from message content and responds in the same language.

### Architecture decision: Gemini over Semantic Kernel

The original Phase 3 plan specified Semantic Kernel + OpenAI. We replaced this with:
- **Google Gemini 2.0 Flash** — free tier (1M tokens/day), superior Arabic/Dutch support, native function calling
- **Mscc.GenerativeAI** NuGet package — direct Gemini SDK, no orchestration layer overhead
- **No vector database** — portfolio JSON (~3K tokens total) fits in one context window; system prompt is rebuilt per-request from cached `IContentRepository` data (15-min TTL)

### Files changed

**Backend — Application layer**
- `Application/DTOs/ChatDto.cs` — `ChatMessageDto`, `ChatRequestDto`, `PageContextDto`
- `Application/Interfaces/IChatService.cs` — `IChatService` + `ChatEventDto` discriminated union (`TextDeltaEvent`, `ActionEvent`)

**Backend — Infrastructure layer**
- `Infrastructure/AmrPortfolio.Infrastructure.csproj` — added `Mscc.GenerativeAI`
- `Infrastructure/AI/GeminiChatService.cs` — builds system prompt from `IContentRepository`, defines 5 Gemini tool declarations, streams text deltas + action events
- `Infrastructure/DependencyInjection.cs` — extended to accept `IConfiguration`, registers `IChatService`

**Backend — API layer**
- `Api/Endpoints/ChatEndpoints.cs` — `POST /v1/chat` SSE endpoint; streams `{"type":"delta","content":"..."}` and `{"type":"action","name":"...","payload":{...}}` events; validates message length (1–2000 chars)
- `Api/Program.cs` — registers chat endpoint; passes `builder.Configuration` to `AddInfrastructure()`

**Frontend**
- `features/ChatWidget/useChatStream.ts` — SSE reading hook; `fetch()` + `ReadableStream`; sends last-10-message history cap; `AbortController` cleanup
- `features/ChatWidget/ChatActionHandler.ts` — executes agent actions via `router.push` / `window.open`
- `features/ChatWidget/ChatMessage.tsx` — individual message bubble (user violet right, assistant card left); typing dots + streaming cursor
- `features/ChatWidget/ChatWindow.tsx` — glassmorphism panel; framer-motion slide-up; auto-scroll; RTL-aware
- `features/ChatWidget/ChatBubble.tsx` — fixed `Sparkles` FAB, violet glow, framer-motion hover/tap
- `features/ChatWidget/ChatWidget.tsx` — root client component; page context from `usePathname()`; closes on outside click
- `features/ChatWidget/ChatWidgetLoader.tsx` — async Server Component; fetches profile (needed by action handler), renders `<ChatWidget>`; returns `null` on API failure
- `app/globals.css` — `/* === Chat Widget === */` block: all `.chat-*` classes, keyframes, dark/light overrides, mobile breakpoint
- `app/[locale]/layout.tsx` — added `<ChatWidgetLoader locale={locale} />` inside `<ThemeProvider>`
- `apps/api/src/AmrPortfolio.Api/AmrPortfolio.Api.csproj` — added `<UserSecretsId>amr-portfolio-api</UserSecretsId>`
- `tests/AmrPortfolio.UnitTests/.../JsonContentRepositoryTests.cs` — fixed stale DTO constructors (missing `SchedulingUrl`, `ExperienceId`, `Domain` params)

**i18n**
- `messages/{en,ar,nl}.json` — added `ChatWidget` namespace (title, placeholder, greeting, greetingExperience, errorMessage, poweredBy)

### Agent tools (Gemini function calling)

| Tool | Trigger examples | Frontend action |
|---|---|---|
| `navigate_to_page` | "show me backend work", "tell me about TIQM" | `router.push(/experience?domain=backend)` |
| `open_booking` | "book a call", "schedule a meeting" | `window.open(profile.schedulingUrl)` |
| `open_linkedin` | "connect on LinkedIn" | `window.open(profile.linkedInUrl)` |
| `open_github` | "your GitHub" | `window.open(profile.gitHubUrl)` |
| `download_resume` | "get your CV", "download resume" | `window.open(profile.resumeUrl)` |

### Multilingual strategy

Gemini system prompt instructs: detect user message language → respond in same language. `ChatRequestDto.Locale` is sent as a fallback hint for ambiguous short inputs ("Hi", "OK"). No extra libraries needed — Gemini 2.0 Flash handles EN/AR/NL natively.

### SSE event format

```
data: {"type":"delta","content":"The TIQM project..."}
data: {"type":"action","name":"navigate_to_page","payload":{"slug":"metrixlab-senior"}}
data: [DONE]
```

### API key setup (one-time, per developer machine)

Key is stored in **.NET User Secrets** (never committed). To set or update:
```bash
cd apps/api/src/AmrPortfolio.Api
dotnet user-secrets set "Gemini:ApiKey" "AIzaSy..."
dotnet user-secrets set "Gemini:ModelId" "gemini-2.0-flash"
```
Get a key at https://aistudio.google.com → Get API key. Key format must start with `AIzaSy...`.

### z-index hierarchy (no conflicts)

| Element | z-index |
|---|---|
| Navbar | 40 |
| Language dropdown | 50 |
| Chat FAB + Window | 60 |

### Gotchas

- **`Content` namespace conflict** — `Mscc.GenerativeAI.Content` collides with the .NET `Content` namespace. Aliased with `using GeminiContent = Mscc.GenerativeAI.Content;` in `GeminiChatService.cs`.
- **C# iterator restrictions** — Cannot `yield` inside a `catch` block (CS1631) or inside a `try` block that has a `catch` clause (CS1626). Streaming error handling uses manual `GetAsyncEnumerator()` iteration: `try { MoveNextAsync() } catch { }` with `yield` outside the catch.
- **`.env` file not loaded by .NET** — The `apps/api/.env` and `.env.example` files are documentation only; .NET doesn't read them. All config comes from `appsettings.json` or user secrets. Do not put real values in `.env.example` — it's committed to git.
- **`AQ.` key format IS valid** — Earlier sessions wrongly flagged it as invalid. Newer Google AI Studio keys start with `AQ.`, not `AIzaSy`. Do not confuse format with validity.
- **Streaming exception reaches GlobalExceptionHandler** — Before the fix, a Gemini auth error caused a 500 JSON response even though SSE headers had already been sent. Fixed by catching inside the iterator.
- **API process locks DLLs on rebuild** — `dotnet build` fails with MSB3026 if the API is running. Kill with: `$apiPid = (netstat -ano | Select-String ":5088.*LISTENING")[0] -split "\s+" | Select-Object -Last 1; Stop-Process -Id $apiPid -Force`

---

---

## Session — 2026-06-04

### Files changed

- `apps/api/src/AmrPortfolio.Infrastructure/AI/GeminiChatService.cs` — added `ClassifyGeminiError()` helper; `streamError` type `Exception?` → `string?`; 429/auth errors now surface a human-readable message instead of generic fallback
- `apps/api/.env.example` — removed real API key that was sitting in working copy (never committed); fixed key name `mini__ApiKey` → `Gemini__ApiKey`; replaced value with `YOUR_GEMINI_API_KEY_HERE`

### Decisions

- **`gemini-flash-latest` replaces `gemini-2.0-flash`** — new Google Cloud project has free-tier quota for `gemini-flash-latest` only; `gemini-2.0-flash` returns 429 with `limit: 0`. Model updated via `dotnet user-secrets set "Gemini:ModelId" "gemini-flash-latest"`.
- **Quota is per Google Cloud project, not per API key** — creating a new key in the same project does not reset quota. Required a fresh project.

### Gotchas

- **`Mscc.GenerativeAI` can't parse 429 responses** — the library throws `GeminiApiException` wrapping `JsonException` (not a meaningful quota error). Root cause: Gemini's error body has a nested `"error":{...}` wrapper the library doesn't expect. `ClassifyGeminiError()` works around this by inspecting the exception message string.
- **Gemini API key not in git** — the key was in the working copy of `.env.example` only, never committed. Quota was exhausted by Phase 3 development testing, not scraping.
- **`gemini-2.0-flash` quota** — shows `limit: 0` on the new free-tier project. Use `gemini-flash-latest` until billing is enabled or a paid-tier project is set up.

---

---

## Session — 2026-06-04 (AI widget audit + hardening)

### Files changed

**Backend**
- `Infrastructure/AI/GeminiChatService.cs` — 45s timeout via linked `CancellationTokenSource`; one silent retry on `GeminiApiException`; `ClassifyGeminiError` now returns error codes (not strings) and made `internal`; renamed `gotRateLimited` → `shouldRetry`; removed stale inline comment
- `Application/Interfaces/IChatService.cs` — added `ErrorEvent(string Code)` + `ChatErrorCodes` constants (`rateLimited`, `unavailable`, `timeout`, `configError`, `unknown`)
- `Api/Endpoints/ChatEndpoints.cs` — serialises `ErrorEvent` as `{type:"error",code:...}`; added locale whitelist validation (`en`/`ar`/`nl`) to prevent path traversal
- `Infrastructure/DependencyInjection.cs` — default model changed `"gemini-2.0-flash"` → `"gemini-flash-latest"`
- `apps/api/.env.example` — full Gemini setup guide (key creation, user-secrets commands, quota limits, production env vars)

**Frontend**
- `features/ChatWidget/ChatWindow.tsx` — quick-action chips refactored: labels now come from i18n (`t('quickActions.*')`), AI messages stay in code; `locale` prop removed (no longer needed); `QUICK_ACTIONS` object replaced with `QUICK_ACTION_DEFS` array
- `features/ChatWidget/ChatWidget.tsx` — `translateErrorCode` switch wired to i18n error keys; removed `locale` prop from `ChatWindow` call
- `features/ChatWidget/useChatStream.ts` — `messages` removed from `sendMessage` dep array (was recreating callback on every streaming chunk); added `messagesRef` pattern; added `translateErrorCode` option; `errorMessage` now i18n-sourced
- `features/ChatWidget/AssistantAvatar.tsx` — NEW: illustrated SVG face replaces Sparkles icon
- `features/ChatWidget/ChatBubble.tsx`, `ChatMessage.tsx`, `ChatWindow.tsx` — use `AssistantAvatar` instead of `Sparkles`
- `apps/web/messages/{en,ar,nl}.json` — added `quickActions.*` and `errors.*` keys under `ChatWidget`; removed dead `poweredBy` key; `greeting` shortened to one line

### Decisions

- **Error codes over strings in SSE** — backend sends `{type:"error",code:"rateLimited"}`, frontend translates via i18n. Zero hardcoded English in C#.
- **Quick action chips: direct actions bypass AI** — Experience/Resume/BookCall chips call `handleChatAction` directly; only "Amr's background" goes through Gemini. Reliable even when Gemini is rate-limited.
- **System prompt: intent-based tool use** — replaced keyword matching (`ONLY when user says 'show me'`) with intent reasoning rules. AI now decides navigate vs text based on whether the user wants to explore vs get a quick answer.
- **Illustrated SVG avatar** — replaces Sparkles icon; coded inline, no external file dependency.

### Gotchas

- **`gemini-flash-latest` quota exhausted** during this session. Fix: create new Google Cloud project → new API key → `dotnet user-secrets set "Gemini:ApiKey" "NEW_KEY"`. See `.env.example` for full guide.
- **Locale path traversal** — `JsonContentRepository` builds file paths with the `locale` param from the request body. Now validated at the endpoint level (`en`/`ar`/`nl` only).
- **`sendMessage` dep array** — including `messages` caused the callback to recreate on every streaming delta. Fixed with `messagesRef`.
- **`clearMessages`** exported from `useChatStream` but not yet wired to any UI button. Useful for a future "clear chat" feature.

---

## Next

- **Push current branch** to remote (awaiting user review)
- **Fix Gemini quota**: new Google Cloud project + new API key (see `.env.example`)
- **Add `react-markdown`** to render Gemini markdown (bold, bullets) in chat bubbles
- **Rate limiting** on `POST /v1/chat` (`AddRateLimiter` in Program.cs — fixed window, per-IP)
---

## Next Session — Ordered Backlog

### Immediate (Phase 2/3 finish line)
1. **Fix Gemini quota** — create new Google Cloud project → new API key → `dotnet user-secrets set "Gemini:ApiKey" "NEW_KEY"`. Widget is currently broken without this.
2. **Delete dead files** — `features/ExperienceSection/`, `features/ExperienceCard/`, `features/ExperienceAnimatedList/`, `features/ProjectList/`, `app/[locale]/projects/page.tsx`, `public/icons/aws.svg`
3. **AR/NL content translations** — `content/{ar,nl}/experience.json` + `content/{ar,nl}/projects.json` still have English prose

### Phase 3 remaining
4. **`react-markdown`** — install + wrap assistant message content in `<ReactMarkdown>` inside `ChatMessage.tsx`. Gemini often returns `**bold**` and `- bullets` that render as raw text.
5. **Rate limiting** on `POST /v1/chat` — `builder.Services.AddRateLimiter(...)` + `app.UseRateLimiter()` in `Program.cs`. Fixed window per IP, ~10 req/min. Prevents quota abuse.

### Phase 4 — Production Polish
6. **SEO** — add `generateMetadata` to `/experience/[slug]/page.tsx`, `/contact/page.tsx`, home `page.tsx`
7. **Deployment** — wire Vercel (frontend) + Render (backend); set `NEXT_PUBLIC_API_URL`, `AllowedOrigins`, `Gemini__ApiKey` as platform env vars; enable CI/CD deploy hooks in `.github/workflows/deploy.yml`
8. **Core Web Vitals** — Lighthouse CI audit; check LCP, CLS, INP on home + experience pages
9. **Accessibility** — axe-core sweep; focus on chat widget keyboard nav + Arabic RTL
10. **Frontend tests** — Vitest + React Testing Library; start with `useChatStream` hook and `ChatWindow` chips

---

---

## Session — 2026-06-06 (Phase 4 PLAN — DRAFT, awaiting approval)

> **STATUS: DRAFT — AWAITING USER REVIEW. DO NOT IMPLEMENT.**
> This is a saved plan for review only. No code, no commands until the user explicitly approves after reading. When approved, start with **Group A** — it must be fully green before any deployment work. This supersedes the older "Next Session — Ordered Backlog" above where they overlap.

### Phase 4 — Production Launch: Quality Gate → Deployment → CI/CD → SEO

**Context.** The portfolio is feature-complete (Phases 1–3) but runs only on localhost — not deployed, not crawlable, and with no real safety net: **zero frontend tests**, no coverage thresholds, **no code-smell or duplication detection**. This phase, strictly in order: (1) build a **quality foundation** with enforced test coverage + smell/duplication analysis (local + CI), (2) **deploy** (Next.js→Vercel, .NET 10 API→Render, free, auto-SSL), (3) **automate + SEO** — gated CI/CD (deploy only if the quality gate passes) plus per-page metadata, JSON-LD Person, OG image, complete sitemap to rank for "Amr Madkour".

**Quality approach — no self-hosted server.** Instead of SonarQube/SonarCloud (needs hosting or a public repo to be free), use **build-time analyzers**: backend `SonarAnalyzer.CSharp` (Sonar's C# ruleset as Roslyn analyzers) + Coverlet; frontend `eslint-plugin-sonarjs` + `jscpd` (duplication) + Vitest coverage. Runs in IDE, CLI, and CI; free; private-repo friendly.

**Locked decisions:** Deploy gating = **Gated** (failing gate blocks deploy). Quality = **comprehensive** (coverage + smells + duplication), enforced in CI. Domain = custom name domain supplied later (plan is domain-agnostic via `NEXT_PUBLIC_SITE_URL` / `AllowedOrigins`; launch on platform subdomains, swap later). SSL = automatic/free on both platforms (no cert work).

**Already in place (do NOT rebuild):** backend `coverlet.collector` + `NSubstitute`; CORS + rate limiting + `/health`; root layout metadata + `robots.ts`; CI/CD workflow **stubs** (`.github/workflows/{ci,deploy}.yml` — wire, don't create); `react-markdown`. **Missing:** all frontend tests, smell/duplication detection, `Directory.Build.props`, Dockerfile; sitemap only lists locale roots; per-page metadata + JSON-LD + OG image.

**Gotcha:** API reads `content/` from the **monorepo root** via relative path (`Program.cs:58-59`), overridable by `ContentPath` env — the Dockerfile must build from repo-root context and copy `content/` in.

---

#### Group A — Code Quality & Test Coverage Foundation ⟵ IMPLEMENT FIRST (must be fully green before Group B)
- **A1 Frontend test infra** — add Vitest + `@vitest/coverage-v8` + RTL + jsdom to `apps/web`; `vitest.config.ts` with v8 coverage, reporters text/html/lcov, **enforced thresholds** (start lines/fns/stmts ≥70%, branches ≥60%, ratchet up); scripts `test`/`test:watch`/`test:coverage` + root passthroughs.
- **A2 Frontend tests** — highest-value logic first: `useChatStream.ts` (SSE parse, history cap, abort), `ChatWindow` chips (direct vs AI), `lib/smoothScrollTop.ts`, `toCompleteSentences()`, `services/` wrappers. Meet A1 thresholds with meaningful tests.
- **A3 Frontend smell + duplication** — add `eslint-plugin-sonarjs` to `packages/eslint-config` (cognitive-complexity, no-duplicate-string, no-identical-functions…); add `jscpd` + `.jscpd.json` scanning app/features/components/lib, **fail >~3–5% duplication**; `quality` script chaining lint→typecheck→quality:dupes.
- **A4 Backend coverage** — enforce Coverlet threshold on `dotnet test` (`/p:Threshold=70 /p:ThresholdType=line` or runsettings); add `ReportGenerator` dotnet tool (HTML+console summary) via `dotnet-tools.json`; `coverage.runsettings` scoping to `AmrPortfolio.*`.
- **A5 Backend tests** — `[assembly: InternalsVisibleTo("AmrPortfolio.UnitTests")]`; cover `GeminiChatService.ClassifyGeminiError` (rate-limit/auth/timeout branches), `JsonContentRepository` (locale, cache, missing-file), endpoint validation (locale whitelist, message length). Use `NSubstitute`.
- **A6 Backend smell + duplication (build-time)** — root `apps/api/Directory.Build.props`: `SonarAnalyzer.CSharp` (PrivateAssets=all), `AnalysisLevel=latest-Recommended`, `EnforceCodeStyleInBuild=true`, `TreatWarningsAsErrors=true` (tune via `.editorconfig` severity map so clean code still builds). `dotnet format --verify-no-changes` keeps style.
- **A7 Define the Quality Gate** (single source of truth, documented in `CLAUDE.md`): all tests pass; coverage ≥ threshold (FE+BE); 0 ESLint errors incl. sonarjs; 0 build warnings; duplication ≤ threshold; 0 Sonar BLOCKER/CRITICAL; `dotnet format` clean.
- **A8 Local one-command gate** — root `quality:all` running FE quality+coverage and BE test+coverage+format. **Optional** pre-push hook (Husky FE / shell BE) — mark optional, non-blocking.
- **A9 Wire `ci.yml`** (replace stub) — runs on PR→main/AmrMadkour-develop **and** push→main; **no deploy**. FE job (Node 20): ci → lint(+sonarjs) → typecheck → jscpd → test:coverage → build, upload coverage artifact. BE job (.NET 10): restore → format-verify → build -c Release (SonarAnalyzer + warnings-as-errors) → test w/ Coverlet threshold, upload artifact. Both must pass — this green check gates Group F.

#### Group B — Backend Containerization & Deployment (Render)
- **B1 Dockerfile** — `apps/api/Dockerfile` multi-stage `sdk:10.0`→`aspnet:10.0` (pin 10.0; too new for Render native). **Build context = monorepo root** so root `content/` is reachable; copy `apps/api/` + `content/`; set `ContentPath` in container; `.dockerignore` (node_modules/bin/obj/logs); bind `ASPNETCORE_URLS=http://+:$PORT`. Verify locally: build (root ctx) → run → `/health` + `/v1/profile?locale=en`.
- **B2 Render service** — Web Service, GitHub-connected, env=Docker, Dockerfile `apps/api/Dockerfile`, context=root, health `/health`. Env: `ASPNETCORE_ENVIRONMENT=Production`, `AllowedOrigins=<vercel-origin>`, `Gemini__ApiKey`, `Gemini__ModelId=gemini-flash-latest`, `ContentPath`. **Disable auto-deploy** (gated); Deploy Hook → GitHub secret `RENDER_DEPLOY_HOOK`. ~50s cold start; optional UptimeRobot ping `/health` ~14min.

#### Group C — Frontend Deployment (Vercel)
- **C1 Vercel project** — import repo; **Root Directory = `apps/web`**; Next.js auto-detected; install from root (workspaces). Env (Prod+Preview): `NEXT_PUBLIC_API_URL=<render-url>`, `NEXT_PUBLIC_SITE_URL=<vercel-url-for-now>`. **Disable auto-deploy on main** (gated); Deploy Hook → GitHub secret `VERCEL_DEPLOY_HOOK`; keep per-PR Preview deploys ON.
- **C2 Env & CORS wiring** — set Render `AllowedOrigins` to exact Vercel origin; confirm `services/` reads `NEXT_PUBLIC_API_URL`; document vars in both `.env*.example`.

#### Group D — Security & SSL
- **D1** — SSL: nothing to do (Vercel+Render auto Let's Encrypt incl. custom domains, HTTPS enforced; verify padlock). Secrets: `Gemini__ApiKey` only in Render env; `.env*` gitignored; `git grep` confirms no key tracked. CORS: explicit origin never `*`; Scalar/OpenAPI stays dev-only (`Program.cs:69-73`). Optional/non-blocking: security headers (X-Content-Type-Options, Referrer-Policy, CSP, HSTS) via `next.config.ts headers()`.

#### Group E — SEO (after site is live)
- **E1 Per-page metadata** — `generateMetadata` on `contact/page.tsx`, `experience/page.tsx`, and **dynamic** `experience/[slug]/page.tsx` (title/desc from role+company+description via `getExperience(locale)`). Turns ~20 generic-titled pages into unique, name-bearing, indexable ones.
- **E2 i18n + title fix** — add per-route keys to `messages/{en,ar,nl}.json`; fix inconsistency: layout says "Senior .NET Engineer", profile says "Senior Software Engineer" — align on one (recommend "Senior Software Engineer").
- **E3 JSON-LD Person** (highest name-search lever) — inject `Person` in `layout.tsx`/`components/seo/PersonJsonLd.tsx` from `profile.json`: name, jobTitle, url, image, `sameAs:[linkedInUrl, gitHubUrl]`. Enables Google Knowledge Panel + entity linking.
- **E4 OG/Twitter image** — 1200×630 via `app/opengraph-image.tsx` (`ImageResponse`, branded) + wire `openGraph.images` + `twitter summary_large_image`. Fallback: reuse `public/amr-madkour.jpg`.
- **E5 Sitemap + canonical/hreflang** — extend `sitemap.ts` with `/contact`, `/experience`, and dynamically every `/experience/[slug]` per locale; add `lib/seo.ts` for correct per-path canonical+hreflang (so `/en/contact`→`/ar/contact`), used in each `generateMetadata`.

#### Group F — Gated Deploy Automation (`deploy.yml`)
- **F1** (replace stub) — trigger push→main; run the same Quality Gate as prerequisite steps (self-contained) OR `workflow_run` on `ci.yml`. On all-green: `curl -X POST $VERCEL_DEPLOY_HOOK` + `$RENDER_DEPLOY_HOOK`. Any failure → non-zero exit, **no hook fires**, nothing deploys.

#### Group G — Custom Domain (when user supplies it)
- **G1** — add domain in Vercel → registrar DNS → free SSL auto. Optional `api.<domain>` on Render. Update `NEXT_PUBLIC_SITE_URL` + Render `AllowedOrigins`. If already indexed on `.vercel.app`: old→new redirect + Search Console re-submit.

#### Group H — Off-site Discoverability (manual)
- **H1** — verify domain in **Google Search Console**, submit `sitemap.xml` (optional Bing). Ensure LinkedIn + GitHub link back to the live site (reciprocal `sameAs`). Request homepage indexing; ranking builds over days–weeks.

#### Execution order
`Group A (A1→A9, fully green) → B → C → D → E → F → G → H`. Deployment cannot begin until the quality gate is green.

#### Verification highlights
- **Gate (local):** one command runs FE lint+sonarjs+jscpd+typecheck+coverage and BE format+build+test+coverage; introduce a deliberate duplicate/over-complex fn → confirm it **fails**.
- **Gate (CI):** PR with a violation → `ci.yml` fails, merge blocked; clean PR → green.
- **Docker (local):** build (root ctx) → run → `/health` + `/v1/profile?locale=en`.
- **Render/Vercel:** `<render>/health` warm; Scalar NOT in prod; `/en /ar /nl` load content (CORS proof); chat streams (Gemini proof).
- **Gated deploy:** failing commit→no deploy; clean→hooks fire→site updates.
- **SEO:** view-source detail page → unique title/meta/OG/JSON-LD Person; Google Rich Results Test; sitemap lists all routes+slugs; Lighthouse SEO ~100.
- **Security:** padlock both domains; no key in `git grep`; CORS rejects foreign origin.

#### Open items / notes
- Coverage thresholds start moderate (FE 70/60, BE 70 line), ratchet up — keeps the gate achievable on first pass.
- `SonarAnalyzer` + `TreatWarningsAsErrors` needs one `.editorconfig` calibration pass so clean code still builds.
- Custom domain not yet provided — Groups A–F + H proceed on `.vercel.app`; G swaps it in with zero code changes.
- No self-hosted SonarQube/SonarCloud — build-time analyzers replace it (free, private-repo friendly). SonarLint IDE plugin = optional bonus.
