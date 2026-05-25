import { getTranslations } from 'next-intl/server'
import { getExperience } from '@/services/experience'
import { getProjects } from '@/services/projects'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { ExperiencePageClient } from '@/features/ExperienceTimeline/ExperiencePageClient'

interface Props {
  params: Promise<{ locale: string }>
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
            <h1 className="mb-2">{t('sectionTitle')}</h1>
            <p className="text-muted-foreground">{t('sectionSubtitle')}</p>
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
