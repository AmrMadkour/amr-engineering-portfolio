import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getExperience } from '@/services/experience'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const locales = routing.locales
  const now = new Date()

  // Static pages: home, experience list, contact
  const staticRoutes = ['', '/experience', '/contact']
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${route}`])),
      },
    })),
  )

  // Dynamic experience detail pages — fetched from API using the default locale
  let slugs: string[] = []
  try {
    const experiences = await getExperience('en')
    slugs = experiences.map((e) => e.slug)
  } catch {
    // API unavailable during static export — skip dynamic routes
  }

  const dynamicEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/experience/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}/experience/${slug}`]),
        ),
      },
    })),
  )

  return [...staticEntries, ...dynamicEntries]
}
