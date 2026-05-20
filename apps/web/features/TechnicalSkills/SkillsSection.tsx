import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
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
  const data = SKILLS_DATA[locale] ?? SKILLS_DATA.en

  return (
    <Section id="skills">
      <Container>
        <div className="mb-10">
          <h2 className="mb-2">{t('sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('sectionSubtitle')}</p>
        </div>
      </Container>
      <Container>
        <SkillsCarousel categories={data.categories} />
      </Container>
    </Section>
  )
}
