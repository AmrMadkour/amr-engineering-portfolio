import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionReveal } from '@/components/layout/SectionReveal'
import { SkillsCarousel } from './SkillsCarousel'
import type { SkillsData } from '@/types/skills'

import enSkills from '@content/en/skills.json'
import arSkills from '@content/ar/skills.json'
import nlSkills from '@content/nl/skills.json'

const SKILLS_DATA: Record<string, SkillsData> = {
  en: enSkills as SkillsData,
  ar: arSkills as SkillsData,
  nl: nlSkills as SkillsData,
}

interface SkillsSectionProps {
  locale: string
}

export async function SkillsSection({ locale }: SkillsSectionProps) {
  const t = await getTranslations('Skills')
  const data: SkillsData = (SKILLS_DATA[locale] ?? SKILLS_DATA.en) as SkillsData

  return (
    <Section id="skills">
      <Container>
        <SectionReveal>
          <div className="mb-10 text-center">
            <h2 className="mb-2 section-heading">{t('sectionTitle')}</h2>
            <p className="text-muted-foreground section-subheading">{t('sectionSubtitle')}</p>
          </div>
        </SectionReveal>
      </Container>
      <Container>
        <SkillsCarousel categories={data.categories} />
      </Container>
    </Section>
  )
}
