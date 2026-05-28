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

## Gotchas

- **lucide-react missing icons**: `Github` and `Linkedin` do not exist in the installed version. Use custom SVGs from `@/components/ui/icons` (`GitHubIcon`, `LinkedInIcon`) for brand icons. Check with `node -e "const l = require('./node_modules/lucide-react'); console.log(typeof l.IconName)"` before adding new icons.
- **Old components still on disk**: `ExperienceSection`, `ExperienceCard`, `ExperienceAnimatedList`, `ProjectList/*` all still exist but are no longer wired to any active page. Safe to delete once confirmed, but left in place this session.
- **`/projects` route still exists** at `app/[locale]/projects/page.tsx` — unlinked from navbar but not deleted. Redirect or remove when ready.
- **`cal.com/amrmadkour` URL** hardcoded in Contact page — confirm this is the correct Calendly/Cal.com handle before going live.
- **AR/NL experience.json** — all TODO placeholders are now resolved; full translations written this session.
- **Skill category IDs changed** — `"devops"` → `"cloud-devops"`, `"quality"` removed, new `"architecture"` / `"tools"` / `"ai-productivity"` added. If any component filters by category ID string, update accordingly (none found currently).

---

## Next

1. **Recommendations** — placeholder text still in `content/{en,ar,nl}/recommendations.json`; user will fill with real LinkedIn recommendations when ready.
2. **Metadata/SEO** — detail pages use generic site title; add per-route `generateMetadata` for experience slug pages.
3. **Visual polish pass** — date formatting (`2022-01` → `Jan 2022`), filter bar labels + clear button, experience detail header card, contact page icon colors.
4. **Clean up dead code** — `ExperienceSection`, `ExperienceCard`, `ExperienceAnimatedList`, `ProjectList/*`, `/projects` route still on disk but unlinked.
5. **`cal.com/amrmadkour` URL** hardcoded in Contact page — confirm correct handle before going live.
6. **Next.js fetch cache** — content changes need server restart or `.next/cache/fetch-cache` delete to appear in dev. In prod, redeploy triggers revalidation.
