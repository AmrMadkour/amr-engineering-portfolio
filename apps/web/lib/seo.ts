import { routing } from '@/i18n/routing'

/**
 * Builds canonical + hreflang alternates for a given locale-agnostic path
 * (e.g. '', '/experience', `/experience/${slug}`). Resolved against
 * `metadataBase` (set once in the root layout) into absolute URLs.
 */
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
  }
}
