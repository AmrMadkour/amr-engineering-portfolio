import { ExperienceSection } from '@/features/ExperienceTimeline/ExperienceSection'
import { getExperience } from '@/services/experience'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params
  const experience = await getExperience(locale).catch(() => [])

  return <main><ExperienceSection experience={experience} locale={locale} /></main>
}
