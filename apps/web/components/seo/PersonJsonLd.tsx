import { getProfile } from '@/services/profile'

export async function PersonJsonLd({ locale }: { locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    const profile = await getProfile(locale)

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.title,
      url: `${siteUrl}/en`,
      image: `${siteUrl}/amr-madkour.jpg`,
      sameAs: [profile.linkedInUrl, profile.gitHubUrl].filter(Boolean),
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  } catch {
    return null
  }
}
