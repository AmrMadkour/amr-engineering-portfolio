import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { buildAlternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

const mdxPages = {
  en: () => import('@content/en/pages/privacy-policy.mdx'),
  ar: () => import('@content/ar/pages/privacy-policy.mdx'),
  nl: () => import('@content/nl/pages/privacy-policy.mdx'),
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: `Privacy Policy — ${t('title')}`,
    description: 'Privacy policy for the personal portfolio website of Amr Madkour.',
    alternates: buildAlternates(locale, '/privacy-policy'),
  }
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params
  const key = (locale in mdxPages ? locale : 'en') as keyof typeof mdxPages
  const { default: Content } = await mdxPages[key]()

  return (
    <main>
      <Section id="privacy-policy">
        <Container>
          <div className="mdx-prose mx-auto max-w-2xl py-16">
            <Content />
          </div>
        </Container>
      </Section>
    </main>
  )
}
