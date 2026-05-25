import { getTranslations } from 'next-intl/server'
import type { Recommendation } from '@/types/recommendation'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { RecommendationsCarousel } from './RecommendationsCarousel'

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

export async function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const t = await getTranslations('Recommendations')

  if (recommendations.length === 0) return null

  return (
    <Section id="recommendations">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="mb-2">{t('sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('sectionSubtitle')}</p>
        </div>
        <RecommendationsCarousel recommendations={recommendations} />
      </Container>
    </Section>
  )
}
