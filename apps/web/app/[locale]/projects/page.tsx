import { ProjectsSection } from '@/features/ProjectList/ProjectsSection'
import { getProjects } from '@/services/projects'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params
  const projects = await getProjects(locale).catch(() => [])

  return <main><ProjectsSection projects={projects} locale={locale} /></main>
}
