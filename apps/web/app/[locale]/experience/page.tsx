import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getExperience } from '@/services/experience'
import { getProjects } from '@/services/projects'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { ExperiencePageClient } from '@/features/ExperienceTimeline/ExperiencePageClient'
import { buildAlternates } from '@/lib/seo'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: `Experience — ${t('title')}`,
    description: 'Full career timeline: senior engineering roles across fintech, market research, healthcare, and e-commerce spanning backend, full-stack, and cloud architecture.',
    alternates: buildAlternates(locale, '/experience'),
  }
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('Experience')

  const [experience, projects] = await Promise.all([
    getExperience(locale).catch(() => []),
    getProjects(locale).catch(() => []),
  ])

  return (
    <main>
      <Section id="experience">
        <Container>
          <div className="mb-10">
            <h1 className="mb-2 text-2xl font-bold text-foreground page-head">{t('sectionTitle')}</h1>
            <p className="text-muted-foreground page-subhead">{t('sectionSubtitle')}</p>
          </div>
          <ExperiencePageClient
            experience={experience}
            projects={projects}
            presentLabel={t('present')}
            locale={locale}
          />
        </Container>
      </Section>
    </main>
  )
}
