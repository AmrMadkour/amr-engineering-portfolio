import { getProfile } from '@/services/profile'
import { getExperience } from '@/services/experience'
import { getRecommendations } from '@/services/recommendations'
import { HeroSection } from '@/features/Hero/HeroSection'
import { AboutSection } from '@/features/About/AboutSection'
import { SkillsSection } from '@/features/TechnicalSkills/SkillsSection'
import { ExperiencePreviewSection } from '@/features/ExperiencePreview/ExperiencePreviewSection'
import { RecommendationsSection } from '@/features/RecommendationsCarousel/RecommendationsSection'
import { SectionReveal } from '@/components/layout/SectionReveal'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const [profile, experience, recommendations] = await Promise.all([
    getProfile(locale),
    getExperience(locale),
    getRecommendations(locale),
  ])

  return (
    <main>
      <HeroSection profile={profile} locale={locale} />
      <SectionReveal><AboutSection /></SectionReveal>
      <SectionReveal><SkillsSection locale={locale} /></SectionReveal>
      <ExperiencePreviewSection experience={experience} locale={locale} />
      <RecommendationsSection recommendations={recommendations} />
    </main>
  )
}
