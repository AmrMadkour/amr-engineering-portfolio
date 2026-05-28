import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

type Props = { params: Promise<{ locale: string }> }

export default async function PrivacyPolicyPage({ params }: Props) {
  await params
  const t = await getTranslations('Footer')

  return (
    <main>
      <Section id="privacy-policy">
        <Container>
          <div className="mx-auto max-w-2xl py-16">
            <h1 className="mb-6 text-3xl font-bold text-foreground page-head">{t('privacyPolicy')}</h1>
            <p className="text-muted-foreground page-subhead">
              This page is coming soon.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  )
}
