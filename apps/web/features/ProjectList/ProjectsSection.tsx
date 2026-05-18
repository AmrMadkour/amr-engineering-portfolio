import { getTranslations } from 'next-intl/server'
import type { Project } from '@/types/project'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { ProjectCard } from './ProjectCard'
import { ProjectsClient } from './ProjectsClient'

interface ProjectsSectionProps {
  projects: Project[]
  featured?: boolean
  locale?: string
}

export async function ProjectsSection({ projects, featured = false }: ProjectsSectionProps) {
  const t = await getTranslations('Projects')
  const tCommon = await getTranslations('Common')

  const labels = {
    featured: t('featured'),
    viewLive: t('viewLive'),
    viewRepo: t('viewRepo'),
    present: tCommon('present'),
    filterAll: t('filterAll'),
  }

  const displayed = featured ? projects.filter((p) => p.featured) : projects

  return (
    <Section id="projects">
      <Container>
        <div className="mb-10">
          <h2 className="mb-2">{t('sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('sectionSubtitle')}</p>
        </div>

        {featured ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((project) => (
              <ProjectCard key={project.id} project={project} labels={labels} />
            ))}
          </div>
        ) : (
          <ProjectsClient projects={displayed} labels={labels} />
        )}
      </Container>
    </Section>
  )
}
