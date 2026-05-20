import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Experience } from '@/types/experience'
import type { Project } from '@/types/project'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { ExperienceAnimatedList } from './ExperienceAnimatedList'

interface ExperienceSectionProps {
  experience: Experience[]
  projects?: Project[]
  locale: string
  preview?: boolean
}

export async function ExperienceSection({ experience, projects = [], locale, preview = false }: ExperienceSectionProps) {
  const t = await getTranslations('Experience')

  const displayed = preview ? experience.slice(0, 2) : experience
  const presentLabel = t('present')

  const relatedProjectsMap: Record<string, Project[]> = {}
  for (const exp of experience) {
    relatedProjectsMap[exp.id] = projects.filter((p) => p.experienceId === exp.id)
  }

  return (
    <Section id="experience">
      <Container>
        <div className="mb-10">
          <h2 className="mb-2">{t('sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('sectionSubtitle')}</p>
        </div>

        <ExperienceAnimatedList
          experience={displayed}
          presentLabel={presentLabel}
          relatedProjectsMap={relatedProjectsMap}
          locale={locale}
        />

        {preview && experience.length > 2 && (
          <div className="mt-6">
            <Link
              href={`/${locale}/experience`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('viewAll')}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </div>
        )}
      </Container>
    </Section>
  )
}
