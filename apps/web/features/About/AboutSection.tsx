import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { AboutAnimated } from './AboutAnimated'

export async function AboutSection() {
  const t = await getTranslations('About')

  return (
    <Section id="about">
      <Container>
        <AboutAnimated
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
          paragraphs={[t('p1'), t('p2'), t('p3')]}
        />
      </Container>
    </Section>
  )
}
