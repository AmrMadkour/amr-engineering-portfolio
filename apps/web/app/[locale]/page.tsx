import { getProfile } from '@/services/profile'
import { getProjects } from '@/services/projects'
import { getExperience } from '@/services/experience'
import { getRecommendations } from '@/services/recommendations'
import { HeroSection } from '@/features/Hero/HeroSection'
import { ProjectsSection } from '@/features/ProjectList/ProjectsSection'
import { ExperienceSection } from '@/features/ExperienceTimeline/ExperienceSection'
import { RecommendationsSection } from '@/features/RecommendationsCarousel/RecommendationsSection'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const [profile, projects, experience, recommendations] = await Promise.all([
    getProfile(locale),
    getProjects(locale),
    getExperience(locale),
    getRecommendations(locale),
  ])

  return (
    <main>
      <HeroSection profile={profile} locale={locale} />
      <ProjectsSection projects={projects} featured locale={locale} />
      <ExperienceSection experience={experience} locale={locale} preview />
      <RecommendationsSection recommendations={recommendations} />
    </main>
  )
}
