import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getExperience } from '@/services/experience'
import { getProjects } from '@/services/projects'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { ExperienceDetailView } from '@/features/ExperienceTimeline/ExperienceDetailView'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('Experience')

  const [allExperience, allProjects] = await Promise.all([
    getExperience(locale).catch(() => []),
    getProjects(locale).catch(() => []),
  ])

  const experience = allExperience.find((e) => e.slug === slug)
  if (!experience) notFound()

  const relatedProjects = allProjects.filter((p) => p.experienceId === experience.id)

  return (
    <main>
      <Section id="experience-detail">
        <Container>
          <ExperienceDetailView
            experience={experience}
            relatedProjects={relatedProjects}
            presentLabel={t('present')}
            locale={locale}
          />
        </Container>
      </Section>
    </main>
  )
}
