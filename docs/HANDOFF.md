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

---

---

## Session — 2026-06-08 (UX + Content Polish — COMPLETE)

### Overview

Full UX audit + content polish executed. All "Must" and "Should" items from the saved plan implemented and verified via Playwright (1440px + 390px). Plan is now closed.

### Files changed

**`apps/web/app/globals.css`**
- Hero avatar 280px → 320px desktop; hover `scale(1.04)` + glow pulse added
- `.hero-title` opacity 0.75 → 0.85; size clamp raised (17–24px → 18–26px)
- `.hero-socials` — subtle `border-top` divider + `padding-top: 20px` above social icons
- `.nav-name-first { color: var(--primary) }` — colors first name in navbar
- Hero bio: `line-clamp-4` on ≤860px mobile breakpoint
- Footer top padding 64px → 40px

**`apps/web/app/[locale]/layout.tsx`**
- Added `<noscript><style>` override for `.s-reveal` — sections stay visible without JS (NEW-2)

**`apps/web/components/layout/Navbar.tsx`**
- `<p class="nav-name">Amr Madkour</p>` → `<span class="nav-name-first">Amr</span> Madkour` (UX-9)

**`apps/web/features/Hero/HeroSection.tsx`**
- Hero photo `width`/`height` props 280 → 320 (UX-1)

**`apps/web/features/ExperiencePreview/ExperienceTeaserCard.tsx`**
- Company vs personal colored border distinction (UX-10)
- Personal card title: `experience.role ?? description.split('.')[0]` (NEW-1)
- Card stagger tightened 0.1 + i*0.1s (UX-27)

**`apps/web/features/ExperiencePreview/ExperiencePreviewSection.tsx`**
- Stagger delay tightened (UX-27)

**`apps/web/features/ExperienceTimeline/ExperienceListCard.tsx`**
- Personal icon color `text-muted-foreground/50` → `text-violet-500` (UX-13)
- Personal title: `experience.role ?? description.split('.')[0]` (NEW-1)

**`apps/web/features/ExperienceTimeline/ExperienceFilterBar.tsx`**
- Active pill: `border-primary bg-primary/10 text-primary` → `border-primary bg-primary text-white` (UX-12)

**`apps/web/features/ExperienceTimeline/ExperienceDetailView.tsx`**
- Max-width `max-w-3xl` → `max-w-4xl` (UX-14)
- Back link restyled as button with hover state (UX-15)
- Domain badge added inline with date in header (UX-16)
- End CTA row added: Back to Experience (left) + Get In Touch (right, primary) (UX-17)
- Personal title: `experience.role ?? description.split('.')[0]` (NEW-1)
- Fixed TypeScript narrowing on `DOMAIN_BADGE` index access

**`apps/web/features/TechnicalSkills/SkillIcon.tsx`**
- Added: Kafka, HL7, Next.js, Tailwind CSS, AWS S3, API Gateway, GitHub Actions, TDD icons
- Removed: jQuery entry; `SiAmazons3` import (doesn't exist in package) → `Database` lucide fallback

**`apps/web/features/Footer/FooterSection.tsx`**
- Added Home as first Quick Link (UX-24)

**`apps/web/app/[locale]/contact/page.tsx`**
- Email subtitle → `t('ctaEmailSub')` "Send a message directly" instead of raw gmail (UX-18)
- LinkedIn subtitle → "Connect on LinkedIn" instead of raw URL (UX-19)
- Added `generateMetadata` (SE-19)

**`apps/web/app/[locale]/experience/page.tsx`**
- Added `generateMetadata` (SE-19)

**`apps/web/app/[locale]/experience/[slug]/page.tsx`**
- Added `generateMetadata` with dynamic role+company title (SE-19)

**`apps/web/messages/{en,ar,nl}.json`**
- `Metadata.title` / `Metadata.description` — "Senior .NET Engineer" → "Senior Software Engineer" (SE-18)
- `Contact.headline` → "Let's Work Together" (UX-20)
- `Contact.ctaEmail` → "Email me"; added `Contact.ctaEmailSub` (UX-18)
- `Footer.home` added (UX-24)

**`content/en/skills.json`**
- Removed: jQuery
- Added: Kafka, Next.js, Tailwind CSS, TDD, HL7, AWS S3, API Gateway, GitHub Actions

**`content/{ar,nl}/skills.json`**
- Same structural changes, category titles in respective languages

**`content/en/experience.json`**
- Metrixlab Senior: enriched description with real scale signals (SE-10)
- Metrixlab Developer: stronger verbs, ".NET Framework 4.x" (SE-11, SE-12)
- Talabat: short-term engagement framing (SE-13)
- `amr-portfolio`: `role: null` → `"role": "AMR Engineering Portfolio"` (NEW-1)

**`content/{ar,nl}/experience.json`**
- `amr-portfolio` role fix applied to all locales (NEW-1)

**`content/en/projects.json`**
- Added: `nahdet-misr-hr-payroll` — HR & Payroll Management System (SE-14)
- Added: `smart-innovation-client-platforms` — Client Web Applications & Internal Tools (SE-15)

**`content/{ar,nl}/projects.json`**
- Same two new projects with AR/NL translations

**`content/{ar,nl}/recommendations.json`**
- Translated all 3 recommendations from English into Arabic and Dutch respectively

### Decisions

- **UX-11, NEW-3, UX-26 deferred**: all three are "Nice" priority, no material impact — UX-11 (extra highlight on most-recent teaser card), NEW-3 (timeline spine on list), UX-26 (skeleton loader). Closed the plan without them.
- **UX-7 verified**: About section framer-motion `whileInView` works correctly in a real browser. Playwright fullPage screenshot captures initial `opacity:0` state — not a real user issue.
- **`SiAmazons3` doesn't exist** in `react-icons/si` package — replaced with `Database` lucide icon (same bg color).

### Gotchas

- **react-icons/si gaps**: before adding a new `Si*` import, verify the export name exists in the package. `SiAmazons3` looked valid but doesn't exist — `SiAmazonwebservices` is the brand logo, no per-service S3 icon available.

---

## Next

- **SSH push fixed** — `core.sshCommand = wsl ssh` set in `.git/config`. Claude Code's Bash tool now routes git over WSL SSH (where the GitHub key lives). Manual pushes from VS Code WSL are unaffected.
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

---

---

## UX + Content Polish Plan — COMPLETE ✓

> **STATUS: FULLY IMPLEMENTED — 2026-06-08.**
> Full audit performed via Playwright (desktop 1440px + mobile 390px) across all pages + complete content JSON review.
> Implementation order: approve Role 1 (UX) → implement → approve Role 2 (Content) → implement. Both are independent.

---

### Role 1 — Senior UX Designer

#### Image & Photo Decisions (Direct Answers)
- **3 images (hero/contact/footer) — not too much.** Each serves a distinct purpose. Keep all three.
- **Hero photo** (`amr-madkour-2.jpg`, outdoor smart-casual): good choice, approachable + professional. Issue is display size (280px too small on desktop), not the photo itself.
- **Contact photo** (`amr-madkour.jpg`, formal event/suit/flags): stronger photo — confident, professional. Keep it on contact page.
- **Hero photo hover animation**: currently absent — worth adding (subtle scale + glow).

#### Hero Section
- **UX-1** Hero photo too small on desktop (280px) — increase to 340×340px desktop, keep 200px ≤860px
- **UX-2** No hover animation on hero photo — add `scale(1.04)` + glow pulse on hover, 0.3s ease
- **UX-3** Too much empty vertical space in hero (`clamp(520px, 62vh, 700px)`) — change `min-height` to `auto`, use padding only
- **UX-4** "Senior Software Engineer" title has same visual weight as bio — increase size slightly, reduce opacity 0.75→0.85
- **UX-5** Social icon row feels disconnected from CTAs — add subtle divider above or integrate with CTA row
- **UX-6** Page `<title>` says "Senior .NET Engineer" but page says "Senior Software Engineer" — align via `generateMetadata`

#### About Section
- **UX-7** `AboutAnimated` uses Framer Motion `whileInView` — verify paragraphs 2 & 3 are visible in real browser; if broken, migrate to CSS `s-reveal` + `IntersectionObserver` pattern used everywhere else

#### Navbar
- **UX-8** Avatar photo removed from navbar — restore 52×52 circular avatar next to name (adds personal recognition)
- **UX-9** "Amr Madkour" name is plain white — color first name "Amr" in `var(--primary)` for brand signature

#### Experience Preview (Home — 3 cards)
- **UX-10** No visual distinction between company vs personal project cards — add colored left-border or type badge per card
- **UX-11** All 3 cards equal visual weight — give most recent (Metrixlab Senior) a faint primary-tinted border

#### Experience List Page
- **UX-12** Active filter pill uses only outline ring — change to solid filled background (`bg-primary text-white`)
- **UX-13** All cards use same icon/color — give Personal Project cards different icon color (violet/amber)

#### Experience Detail Pages
- **UX-14** Content too narrow (~680px) on 1440px viewport — feels like a blog post; increase max-width to ~860px
- **UX-15** "← All Experience" back link is tiny plain text — style as proper back button with hover state
- **UX-16** Detail header card is text-only — add domain badge (`{BE}` / `{FS}`) or colored accent to header
- **UX-17** Pages end: content → blank gap → footer — add "Back to Experience" or "View full timeline" CTA before footer

#### Contact Page
- **UX-18** Email `mismadkor14@gmail.com` is personal-style — use professional email or display as "Email me" without raw address
- **UX-19** LinkedIn shows full raw URL — display as `linkedin.com/in/amr-madkour` (shortened)
- **UX-20** Heading "Want to work together?" slightly informal — change to "Let's Work Together" or "Get In Touch"

#### Mobile (390px)
- **UX-21** Skills carousel shows only ~1.3 cards on mobile — reduce card width to 220px so ~1.6 cards visible (suggests scrollability)
- **UX-22** Hero bio is long and dense on small screen — add `line-clamp-4` on mobile, `sm:line-clamp-none`
- **UX-23** Chat FAB may overlap content on some pages — verify no clipping, adjust bottom offset if needed

#### Footer
- **UX-24** "Quick Links" missing Home — add as first entry
- **UX-25** Footer top padding 64px → reduce to 40px (less empty space)

#### Animations
- **UX-26** No skeleton loader on experience list — add minimal pulse skeleton for the API fetch gap
- **UX-27** Experience preview card stagger delay too slow (0.45s for 3rd card) — tighten to `0.1 + i * 0.1s`

**Priority: Must** = UX-1,2,3,6,8,14,18,19 | **Should** = UX-4,7,9,10,12,15,17,20,21,24 | **Nice** = UX-5,11,13,16,22,23,25,26,27

---

### Role 2 — Senior Software Engineer (Content Review)

> Writing quality is clean throughout — no spelling or grammar errors found. Issues are about completeness, depth, and positioning.

#### Skills (highest ROI — missing skills already demonstrated in projects)
- **SE-1** Kafka missing from skills — used in 2 experience entries ← most glaring omission
- **SE-2** Next.js missing from Frontend Development — used in portfolio project
- **SE-3** Tailwind CSS missing — used in portfolio project; CSS3 is too generic
- **SE-4** jQuery listed in Frontend — signals 2010s tech in 2026; remove entirely
- **SE-5** Angular listed but appears in zero projects/experience — verify and add project, or remove
- **SE-6** TDD explicitly used in Consumer Event Platform project but not in skills — add to Architecture & Quality
- **SE-7** HL7 used in Meditop Medical but not in skills — add to Backend Development
- **SE-8** AWS services (S3, CloudWatch, API Gateway) in projects/experience but not in skills — surface in Cloud & DevOps
- **SE-9** GitHub Actions missing from Cloud & DevOps — now dominant CI/CD tool

#### Experience Descriptions
- **SE-10** Metrixlab Senior — strong but no scale metrics; add one concrete number (team size, survey volume, infra scale)
- **SE-11** Metrixlab Developer — ".NET 4" phrasing → ".NET Framework 4.x"
- **SE-12** Metrixlab Developer — "worked across" / "supported" are weak verbs → "Engineered" / "maintained and scaled"
- **SE-13** Talabat — 4-month tenure with no context; add one sentence framing it as a targeted short-term engagement
- **SE-14** Nahdet Misr — 0 projects linked despite 5 internal systems; add 1 project card (HR + Payroll system)

#### Projects
- **SE-15** Smart Innovation — 0 projects (entry-level, optional); add 1 small project to round out career arc
- **SE-16** HoloLens POC — says "POC" but doesn't explain the business use case; add the intended domain (industrial, research, etc.)

#### Recommendations
- **SE-17** All 3 recommendations are generic (personality traits only, no technical achievements) — reach out to Wendy Boonstra, Moinudeen Rahmathulla, Mostafa Metwally for revised testimonials mentioning specific projects, metrics, or contributions

#### Metadata & Positioning
- **SE-18** Browser tab title "Senior .NET Engineer" vs page "Senior Software Engineer" — align all metadata to "Senior Software Engineer"
- **SE-19** `generateMetadata` missing from `/experience/[slug]`, `/experience`, `/contact` — add unique title+description per route

**Priority: Must** = SE-1,2,3,4,5,18 | **High** = SE-6,10,12,14,17 | **Should** = SE-7,8,9,11,13,19 | **Optional** = SE-15,16

---

## Session — 2026-06-08 (Privacy Policy + SSH fix)

### Files changed

- `.git/config` — `core.sshCommand = wsl ssh` (SSH push fix)
- `content/{en,ar,nl}/pages/privacy-policy.mdx` — new; 5-section policy (Analytics, Cookies, Data Storage, Your Rights, Contact)
- `apps/web/app/[locale]/privacy-policy/page.tsx` — rebuilt: locale→MDX import map, `generateMetadata`; replaced placeholder
- `apps/web/next.config.ts` — added `remark-gfm` plugin so MDX tables render as `<table>` not raw text
- `apps/web/app/globals.css` — added `.mdx-prose` block (h1/h2, p, a, ul, table, code, hr styles)

### Decisions

- **Privacy policy in MDX, not JSON** — it's a document (prose + formatting), not structured data. JSON would require dozens of awkward keys or raw HTML strings. The `content/{locale}/pages/` MDX pattern was already established.
- **No Google Analytics** — not needed for a personal portfolio; avoids cookie consent banner and third-party script overhead.
- **Policy kept short** — 5 sections covering what a visitor actually needs to know. Legal boilerplate (data controller address, retention schedule, 8-section structure) removed.

### Gotchas

- **SSH push from Claude Code** — the Bash tool runs in Git Bash (Windows), which has no SSH agent. User's key lives in WSL. Fix: `core.sshCommand = wsl ssh` in `.git/config` routes git SSH through WSL. Manual pushes from VS Code WSL terminal are unaffected.
- **`remark-gfm` required for MDX tables** — `@next/mdx` does not render GFM tables by default. Without the plugin, pipe-syntax tables render as a single paragraph of text. Installed as a workspace dep in `apps/web`.

### Next → Group A then Group B

---

## Session — 2026-06-09 (Phase 4 Group A — Quality Gate Foundation)

### Overview

All of Group A (A1–A9) completed. The portfolio now has a full quality safety net: frontend tests with enforced coverage thresholds, SonarJS smell + jscpd duplication detection, backend tests (56 tests, 79.7% line coverage), build-time Sonar analyzers with TreatWarningsAsErrors, and a real CI pipeline replacing the placeholder stub.

### Files changed

**Frontend (A1–A3)**
- `apps/web/vitest.config.ts` — NEW; v8 coverage, text/html/lcov reporters, thresholds lines/fns/stmts ≥70% branches ≥60%
- `apps/web/package.json` — `test`, `test:watch`, `test:coverage`, `quality`, `quality:dupes` scripts
- `apps/web/setup-tests.ts` — `@testing-library/jest-dom` global setup
- `apps/web/__tests__/*.test.ts(x)` — 9 test files covering: `useChatStream` SSE parsing/abort/history cap, `ChatWindow` chip routing, `smoothScrollTop`, `toCompleteSentences`, `api` fetch wrappers, `CookieNotice` dismiss logic
- `packages/eslint-config/index.js` — added `eslint-plugin-sonarjs`
- `.jscpd.json` (root) — jscpd config, threshold 5%, scans `apps/web/{app,features,components,lib}`
- `package.json` (root) — `quality:all`, `quality:api`, `test:api`, `test:api:coverage` scripts

**Backend (A4–A6)**
- `apps/api/coverage.runsettings` — Coverlet threshold 70% line, scoped to `AmrPortfolio.*`
- `apps/api/.config/dotnet-tools.json` — `dotnet-reportgenerator-globaltool`
- `apps/api/Directory.Build.props` — NEW; `SonarAnalyzer.CSharp 10.*`, `TreatWarningsAsErrors=true`, `AnalysisLevel=latest-Recommended`, `EnforceCodeStyleInBuild=true`
- `apps/api/.editorconfig` — NEW; suppressions for CA1305, CA1873, CA1848, S2094, S1135, S2139, CA1707, CA2201
- `apps/api/tests/AmrPortfolio.UnitTests/Infrastructure/Content/JsonContentRepositoryRealTests.cs` — NEW; 11 real-file tests (all locales, caching, unknown locale throws)
- `apps/api/tests/AmrPortfolio.UnitTests/Api/ChatEndpointsValidationTests.cs` — NEW; 11 integration tests via `WebApplicationFactory` (locale whitelist, message length, SSE content-type, [DONE] signal)
- `apps/api/tests/AmrPortfolio.UnitTests/AI/GeminiChatServiceTests.cs` — added `StreamResponseAsync_WhenRepoThrows_YieldsUnavailableError`
- `apps/api/src/AmrPortfolio.Api/Program.cs` — `app.Run()` → `await app.RunAsync()`, `Log.CloseAndFlush()` → `await Log.CloseAndFlushAsync()`, `protected Program() {}` ctor for WebApplicationFactory
- `apps/api/src/AmrPortfolio.Infrastructure/Content/JsonContentRepository.cs` — removed unused `CancellationToken ct` from `GetCachedAsync<T>` (S1172)
- `CLAUDE.md` — appended "Quality Gate (single source of truth)" section

**CI (A9)**
- `.github/workflows/ci.yml` — replaced placeholder: two real jobs (FE Node 20, BE .NET 10), triggers push+PR on both branches, uploads coverage artifacts, no deploy

### Decisions

- **Per-test `WebApplicationFactory` instantiation** — originally used `IClassFixture<ChatTestApiFactory>` (shared server). After 10 requests the `FixedWindowRateLimiter` started returning 429 instead of expected status codes. Fix: removed `IClassFixture`, each test creates its own factory instance (implements `IDisposable`).
- **`GeminiChatService.StreamResponseAsync` excluded from coverage** — the live streaming body requires a real Gemini API key and cannot be meaningfully unit-tested. Setup-failure path (mock repo throws) IS covered. Exclusion documented in `CLAUDE.md` coverage note.
- **`dotnet format` run twice** — first pass normalized most CRLF; a second pass was needed before `--verify-no-changes` passed cleanly.

### Gotchas

- **MSB3026 file lock during `dotnet build`** — dev API process was running and locked the DLLs. Fix: `Stop-Process -Name "AmrPortfolio.Api" -Force` before building.
- **Rate limiter in tests** — `FixedWindowRateLimiter(PermitLimit=10)` applies inside `WebApplicationFactory`. With 13 tests sharing one factory instance, tests 11–13 got 429. Per-test factory avoids this entirely.
- **`dotnet format --verify-no-changes` ENDOFLINE errors** — some files still had `\n` line endings after first format pass. Run `dotnet format` (no verify flag) once to normalize, then the verify-flag pass will be clean.

### Final state (commit `5ecc727`)

- 56 backend tests passing (was 29), 79.7% line / 89.5% branch coverage
- `dotnet build -c Release` → 0 warnings, 0 errors
- `quality:all` → end-to-end green
- `ci.yml` → real FE + BE jobs, green

### Next → Group B (B1 Dockerfile, then B2 Render account)

---

## Session — 2026-06-09 (Phase 4 Groups B/E/F — Dockerfile, SEO, Deploy Pipeline)

### Files changed

- `apps/api/Dockerfile` — NEW; multi-stage `sdk:10.0` → `aspnet:10.0`; build context = repo root so `content/` is reachable; `ContentPath=/app/content`; shell ENTRYPOINT expands `${PORT:-8080}` for Render
- `.dockerignore` — NEW at repo root; excludes `node_modules/`, `apps/web/`, `**/bin/`, `**/obj/`, test code, docs
- `apps/web/components/seo/PersonJsonLd.tsx` — NEW; async Server Component; fetches profile, emits `<script type="application/ld+json">` (Person schema: name, jobTitle, url, image, sameAs)
- `apps/web/app/opengraph-image.tsx` — NEW; 1200×630 branded OG card via `ImageResponse` (edge runtime); dark bg, violet accent, name + title + stack tagline
- `apps/web/app/sitemap.ts` — extended; adds `/contact`, `/experience`, and all `/experience/[slug]` per locale with hreflang `alternates`; graceful catch if API is down
- `apps/web/app/[locale]/layout.tsx` — added `<PersonJsonLd locale={locale} />` inside `<body>`
- `.github/workflows/deploy.yml` — replaced placeholder; uses `workflow_run` on `CI` + `conclusion == 'success'` + `head_branch == 'main'`; fires Vercel + Render deploy hooks; no-op if secrets not set
- `apps/web/.env.local.example` — added production URL comments for `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SITE_URL`

### Decisions

- **Shell-form ENTRYPOINT** — `ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} exec dotnet AmrPortfolio.Api.dll"]`. Render injects `PORT` dynamically at container start; `ENV` instructions expand at build time, not runtime, so shell form is required.
- **`workflow_run` not `push` in deploy.yml** — guarantees the quality gate (ci.yml) passed before any hook fires. A direct `push` trigger would race with CI.
- **JSON-LD in `<body>` not `<head>`** — App Router has no explicit `<head>` slot for Server Components; body placement is valid and crawled correctly by Google.
- **Sitemap catches API errors** — if the API is unreachable during a cold Vercel build, dynamic slugs are omitted rather than crashing the build.

### Gotchas

- **Docker Desktop not installed** — Dockerfile is written but local `docker build` verification is pending. Command: `docker build -f apps/api/Dockerfile -t amr-portfolio-api:local .` from repo root.
- **`/sitemap.xml` times out in Playwright** (30 s tool limit) but works correctly — first-load compilation + API call exceeds the tool timeout. Verified green via `curl --max-time 60`.
- **`.editorconfig` `end_of_line` must match `.gitattributes`** — `.gitattributes` uses `eol=lf`; `.editorconfig` must also use `end_of_line = lf`. If they diverge, CI (Ubuntu) fails `dotnet format --verify-no-changes` with ENDOFLINE errors on every `.cs` file. Fixed in commit `3f002c8`.
- **`gh` CLI path** — installed at `C:\Program Files\GitHub CLI\gh.exe`; not on PATH in Claude Code tool sessions. Use `$gh = "C:\Program Files\GitHub CLI\gh.exe"; & $gh ...` in PowerShell tool calls.

---

## Session — 2026-06-09 (CI fix — line ending normalization)

### Files changed

- `apps/api/.editorconfig` — `end_of_line = crlf` → `end_of_line = lf` (aligns with `.gitattributes eol=lf`)
- `apps/api/src/**/*.cs`, `apps/api/tests/**/*.cs` — `dotnet format` re-run to normalize on-disk CRLF → LF (no content change in git; files were already LF in the repo)

### Decision

The conflict: `.gitattributes` stores and checks out all files as LF; `.editorconfig` told `dotnet format` to enforce CRLF. CI (Ubuntu) checked out LF files, then `dotnet format --verify-no-changes` failed demanding CRLF on every line of every `.cs` file. Fix is one line in `.editorconfig`. Running `dotnet format` afterward ensures on-disk files match so the local verify-no-changes also passes.

### Next

**CI is green. Manual steps required (cloud accounts):**
1. ~~**Local Docker verify**~~ ✓ DONE — see session 2026-06-10 below
2. **B2 Render** — create Web Service, Docker env, Dockerfile `apps/api/Dockerfile`, context = root; set `ASPNETCORE_ENVIRONMENT=Production`, `AllowedOrigins=<vercel-url>`, `Gemini__ApiKey`, `Gemini__ModelId=gemini-flash-latest`, `ContentPath=/app/content`; disable auto-deploy; copy Deploy Hook URL → GitHub secret `RENDER_DEPLOY_HOOK`
3. **C1 Vercel** — import repo; Root Directory = `apps/web`; set `NEXT_PUBLIC_API_URL` (Render URL) + `NEXT_PUBLIC_SITE_URL` (Vercel URL); disable auto-deploy on main; copy Deploy Hook → GitHub secret `VERCEL_DEPLOY_HOOK`
4. **C2 CORS** — update Render `AllowedOrigins` to exact Vercel origin once both URLs are known
5. **G/H** — custom domain + Google Search Console (when domain is ready)

---

## Session — 2026-06-10 (B1 Docker verification — COMPLETE)

### What happened

Docker Desktop installed and working. Built and ran the API image locally to verify the Dockerfile is correct end-to-end.

**Commands run (from repo root):**
```bash
docker build -f apps/api/Dockerfile -t amr-portfolio-api:local .
docker run -d --name amr-api-test -p 8080:8080 -e PORT=8080 -e Gemini__ApiKey=placeholder -e Gemini__ModelId=gemini-flash-latest amr-portfolio-api:local
```

**Results:**
- `/health` → `200 {"status":"healthy"}` ✓
- `/v1/profile?locale=en` → `200` with real Amr Madkour profile content ✓
- `content/` folder correctly bundled inside the image ✓
- `PORT` env var expansion via shell ENTRYPOINT works ✓

### Gotcha — Gemini key required at startup

`DependencyInjection.AddInfrastructure` throws `InvalidOperationException` if `Gemini:ApiKey` is missing — the app won't start at all, even for non-chat endpoints. For local Docker testing pass `-e Gemini__ApiKey=placeholder`. For Render, set the real key as an env var (mandatory).

### Deploy Hook — not yet found

Tried to locate the Render Deploy Hook URL to store as GitHub secret `RENDER_DEPLOY_HOOK`. Could not find it. Two reasons this might happen:
- **Service not yet deployed** — the Deploy Hook only appears in the Render UI after the first successful deploy.
- **UI location**: Settings → Build & Deploy → Deploy Hook section (Render has moved this around).

**Alternative if hook stays hidden:** Update `deploy.yml` to use the Render API directly (`curl -X POST "https://api.render.com/v1/services/<service-id>/deploys" -H "Authorization: Bearer <api-key>"`). Ask Claude to update the workflow when ready.

### Status

- B1 ✓ Docker image builds and runs correctly
- B2 IN PROGRESS — Render service not yet created/deployed
- C1/C2 NOT STARTED — waiting on Render URL

### Next session pick-up

1. **Create Render Web Service** — Docker env, Dockerfile `apps/api/Dockerfile`, context = repo root (blank or `.`). Set env vars (see above). Do first deploy to get the service URL.
2. **Get Deploy Hook URL** — after first deploy: Settings → Build & Deploy → Deploy Hook → copy URL → GitHub repo Settings → Secrets and variables → Actions → New secret → `RENDER_DEPLOY_HOOK`.
3. **C1 Vercel** — import repo, Root Directory = `apps/web`, set `NEXT_PUBLIC_API_URL` = Render URL, `NEXT_PUBLIC_SITE_URL` = Vercel URL, disable auto-deploy on main, copy Deploy Hook → GitHub secret `VERCEL_DEPLOY_HOOK`.
4. **C2 CORS** — update Render env var `AllowedOrigins` to exact Vercel origin.
5. **Test end-to-end** — Vercel frontend loads, calls Render API, chat widget streams (needs real Gemini key on Render).

---

## Session — 2026-06-11 (Live deployment smoke test + fixes)

### What happened

First full end-to-end smoke test against the live Vercel + Render deployment. Render and Vercel were already up (done before this session). CORS was updated from `*` to the exact Vercel origin just before this session started.

### Status after this session

| Group | Item | Status |
|---|---|---|
| A | Quality gate (tests, lint, CI) | ✓ Done |
| B1 | Dockerfile + local verify | ✓ Done |
| B2 | Render Web Service deployed | ✓ Done |
| C1 | Vercel project imported + deployed | ✓ Done |
| C2 | CORS `AllowedOrigins` → exact Vercel origin | ✓ Done |
| D1 | Security verification | ✓ Done (see below) |
| F1 | `deploy.yml` GitHub secrets | ⚠ Pending — secrets not yet wired |
| G | Custom domain | Pending — domain not yet provided |
| H | Google Search Console | Pending — needs live domain first |

### Files changed

- `.gitignore` — added `!apps/web/public/**/*.png` negation; the blanket `*.png` rule (dev screenshot guard) was also blocking production icon assets in `public/`
- `apps/web/public/icons/{agile,azure-devops,csharp,visual-studio,vscode}.png` — committed for the first time; were on disk but never tracked, causing 404s on Vercel

### Security audit results ✓

- **CORS**: `access-control-allow-origin: https://amr-engineering-portfolio-web.vercel.app` — locked, not `*`
- **API keys in git**: clean — `git grep` found only the error-message template string, no real key
- **Scalar API docs**: blocked in production (returns non-200, not accessible)
- **SSL**: Render is behind Cloudflare + HTTPS; Vercel is HTTPS
- **Optional** (not blocking): security response headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) not yet set in `next.config.ts` — Group D1 noted this as non-blocking

### AI agent broken — Gemini quota/key issue on Render

The chat widget shows "The AI is temporarily unavailable." The network request to `POST https://amr-engineering-portfolio.onrender.com/v1/chat` returns HTTP 200 with body:
```
data: {"type":"error","code":"unavailable"}
data: [DONE]
```

CORS is working correctly (200 response, correct `access-control-allow-origin` header). The failure is inside `GeminiChatService`: Gemini throws a `GeminiApiException` that doesn't match the rate-limit or auth patterns in `ClassifyGeminiError`, so it falls through to `ChatErrorCodes.Unavailable`. Most likely cause: **the Gemini API key set in Render env vars has exhausted its quota**, and the `Mscc.GenerativeAI` library wraps the 429 in a way where the message chain doesn't contain "429" or "RESOURCE_EXHAUSTED".

**Fix (manual — requires Render dashboard access):**
1. Go to Google AI Studio → create a **new Google Cloud project** → generate a new API key (quota is per-project, not per-key)
2. Render dashboard → Environment → update `Gemini__ApiKey` to the new key
3. Trigger a manual redeploy on Render
4. Re-test the chat widget on the live site

### SSH push config — permanent fix

`core.sshCommand` was sitting in `.git/config` (local, shared between Windows and WSL contexts), causing pushes from the VS Code WSL terminal to break. Fixed:
- Set `core.sshCommand = wsl ssh` in the **Windows global** git config (`~/.gitconfig`) — applies to Claude Code's Bash tool only
- Removed `core.sshCommand` from `.git/config` (local) — WSL terminal now uses its own native SSH unaffected

### Gotchas

- **`*.png` gitignore rule blocks production assets** — the root `.gitignore` has `*.png` to ignore dev screenshots. Any new icon PNGs added to `public/` will also be blocked unless the `!apps/web/public/**/*.png` negation is already in place (it now is). Same pattern applies to `.jpg` files if a blanket rule is ever added.
- **`core.sshCommand` resets** — if git is ever reinstalled or `.git/config` is regenerated, the local setting may reappear as plain `ssh`. The Windows global config is the durable fix. WSL pushes are unaffected either way.
- **Gemini `unavailable` vs `rateLimited`** — `ClassifyGeminiError` checks exception message strings. When `Mscc.GenerativeAI` wraps a 429 as a `GeminiApiException(JsonException)`, the outer message may just be "Response was not successful" without "429" in it, causing misclassification as `unavailable`. This is a known library quirk — the real fix is a fresh API key on a new project.

### Branch discipline — action required

All changes this session were pushed **directly to `main`**. Going forward, all changes must go through a **pull request** — even small fixes. Direct pushes to `main` bypass the CI quality gate and the gated deploy workflow.

**Required setup:**
1. GitHub repo → Settings → Branches → Add branch protection rule for `main`
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass (select the `CI / frontend` and `CI / backend` jobs from `ci.yml`)
   - ✅ Require branches to be up to date before merging
2. All future work starts on a feature branch → PR → CI green → merge to `main` → `deploy.yml` fires

The `deploy.yml` already uses `workflow_run` on `ci.yml` with `head_branch == 'main'`, so gated deploys are correct — the branch protection just makes it impossible to bypass the gate by pushing directly.

---

## Next steps (ordered)

### Immediate — unblock the AI agent
1. **Fix Gemini quota** — new Google Cloud project → new API key → update `Gemini__ApiKey` on Render → manual redeploy → verify chat widget responds

### Deployment wiring — complete the gated pipeline
2. **Wire GitHub secrets** — once deploy hooks are available in Render + Vercel dashboards:
   - Render: Settings → Build & Deploy → Deploy Hook → copy URL → GitHub repo → Settings → Secrets → `RENDER_DEPLOY_HOOK`
   - Vercel: Project → Settings → Git → Deploy Hook → copy URL → GitHub repo → Secrets → `VERCEL_DEPLOY_HOOK`
3. **Enable branch protection on `main`** — see "Branch discipline" section above; required before any further direct pushes

### Custom domain — Group G
4. **Provide the custom domain** — once the domain name is ready, the steps are:
   - Vercel: Project → Settings → Domains → add domain → update DNS at registrar (CNAME/A record) → free SSL auto-provisions
   - Render: Settings → Custom Domains → add `api.<domain>` (optional) → DNS CNAME to Render URL
   - Update Vercel env var `NEXT_PUBLIC_SITE_URL` to `https://<domain>`
   - Update Render env var `AllowedOrigins` to `https://<domain>` (remove old Vercel subdomain)
   - Update `PersonJsonLd.tsx` `url` field (currently hardcoded or from `NEXT_PUBLIC_SITE_URL`)
   - If site was already indexed on `.vercel.app`: old URL → new URL 301 redirect + Google Search Console re-submit

### Off-site discoverability — Group H (after domain is live)
5. **Google Search Console** — verify domain → submit `https://<domain>/sitemap.xml` → request indexing for homepage
6. **LinkedIn + GitHub** — add the live URL to both profiles (reciprocal `sameAs` links from `PersonJsonLd.tsx`)

### Optional quality improvements (non-blocking)
- **Security headers** in `next.config.ts` — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- **`react-markdown`** in `ChatMessage.tsx` — Gemini responses with `**bold**` and `- bullets` render as raw text currently
- **Rate limiting** on `POST /v1/chat` — `AddRateLimiter` fixed window per IP (~10 req/min) in `Program.cs`

---

## Session — 2026-06-13 (Custom Domain + SEO — COMPLETE)

### What was confirmed done before this session
- **Gemini quota fixed** — new Google Cloud project + new API key set on Render; chat widget working
- **GitHub secrets wired** — `RENDER_DEPLOY_HOOK` + `VERCEL_DEPLOY_HOOK` added to repo secrets; gated deploy pipeline fully operational
- **Branch protection on `main`** — PR required + CI checks (`CI / frontend`, `CI / backend`) must pass before merge

### Domain setup (Group G — COMPLETE)

**Domain:** `amrmadkour.com` (registered via Cloudflare)

**Vercel domains configured:**
- `amrmadkour.com` — primary
- `www.amrmadkour.com` — redirects to root

**Cloudflare DNS records added (both set to DNS-only / grey cloud — required for Vercel SSL):**
| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Env vars updated:**
- Vercel: `NEXT_PUBLIC_SITE_URL` → `https://amrmadkour.com` → redeployed
- Render: `AllowedOrigins` → `https://amrmadkour.com` → redeployed

**Why the sitemap initially failed in Search Console:** `NEXT_PUBLIC_SITE_URL` was still pointing to `https://amr-engineering-portfolio.vercel.app`, so `sitemap.xml` was outputting old-domain URLs. Search Console rejected them ("URL not allowed — 30 instances"). Fixed by updating the env var and redeploying before re-submitting.

### Google Search Console (Group H — COMPLETE)

- Domain property `amrmadkour.com` verified via Cloudflare DNS TXT record
- Sitemap `https://amrmadkour.com/sitemap.xml` submitted — **Success** (lists all pages: home/experience/contact × 3 locales + 7 experience detail pages × 3 locales)
- Indexing requested for `https://amrmadkour.com/en` and `https://amrmadkour.com`

### Status — Phase 4 complete

| Group | Item | Status |
|---|---|---|
| A | Quality gate (tests, lint, CI) | ✓ Done |
| B | Dockerfile + Render deploy | ✓ Done |
| C | Vercel deploy + CORS | ✓ Done |
| D | Security verification | ✓ Done |
| E | SEO (metadata, JSON-LD, OG, sitemap) | ✓ Done |
| F | Gated deploy pipeline | ✓ Done |
| G | Custom domain `amrmadkour.com` | ✓ Done |
| H | Google Search Console + sitemap | ✓ Done |

### Gotchas

- **Cloudflare proxy must be OFF (grey cloud)** for the DNS records pointing to Vercel. Orange cloud (proxied) interferes with Vercel's SSL provisioning and certificate validation.
- **`NEXT_PUBLIC_SITE_URL` drives everything** — sitemap URLs, robots.txt sitemap pointer, canonical tags, OG URLs, JSON-LD Person `url` field. If the domain ever changes, this is the one env var to update in Vercel.
- **`amr-engineering-portfolio-web.vercel.app` still exists** — Vercel's permanent internal URL; cannot be removed. Doesn't affect SEO because all canonicals point to `amrmadkour.com`. Render's `AllowedOrigins` no longer includes it — requests from the old Vercel subdomain will be CORS-rejected (intentional).

---

## Next steps (ordered)

### Manual — off-site discoverability (do now)
1. **LinkedIn profile** — Edit profile → Website field → add `https://amrmadkour.com`
2. **GitHub profile** — Edit profile → Website → add `https://amrmadkour.com`

These complete the `sameAs` loop in `PersonJsonLd.tsx` — Google sees LinkedIn, GitHub, and the portfolio all pointing to each other, which is the trigger for a Knowledge Panel for "Amr Madkour".

### Code improvements (non-blocking)
3. **`react-markdown`** — install + wrap assistant message content in `<ReactMarkdown>` in `ChatMessage.tsx`. Gemini responses with `**bold**` and `- bullets` render as raw text.
4. **Rate limiting** on `POST /v1/chat` — `AddRateLimiter` fixed window per IP (~10 req/min) in `Program.cs`. Prevents Gemini quota abuse.
5. **Security headers** in `next.config.ts` — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.

### Housekeeping
6. **Delete dead files** — `features/ExperienceSection/`, `ExperienceCard/`, `ExperienceAnimatedList/`, `ProjectList/`, `app/[locale]/projects/page.tsx`, `public/icons/aws.svg`
7. **AR/NL translations** — `content/{ar,nl}/experience.json` + `content/{ar,nl}/projects.json` still have English prose
