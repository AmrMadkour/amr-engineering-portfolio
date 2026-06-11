import { getTranslations } from 'next-intl/server'
import type { Recommendation } from '@/types/recommendation'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionReveal } from '@/components/layout/SectionReveal'
import { RecommendationsGrid } from './RecommendationsGrid'

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

export async function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const t = await getTranslations('Recommendations')

  if (recommendations.length === 0) return null

  return (
    <Section id="recommendations">
      <Container>
        <SectionReveal>
          <div className="mb-10 text-center">
            <h2 className="mb-2 section-heading">{t('sectionTitle')}</h2>
            <p className="text-muted-foreground section-subheading">{t('sectionSubtitle')}</p>
          </div>
        </SectionReveal>
        <RecommendationsGrid recommendations={recommendations} />
      </Container>
    </Section>
  )
}
