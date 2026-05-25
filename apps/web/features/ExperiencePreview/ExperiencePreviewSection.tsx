import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Experience } from '@/types/experience'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionReveal } from '@/components/layout/SectionReveal'
import { ExperienceTeaserCard } from './ExperienceTeaserCard'

interface Props {
  experience: Experience[]
  locale: string
}

export async function ExperiencePreviewSection({ experience, locale }: Props) {
  const t = await getTranslations('Experience')
  const presentLabel = t('present')

  const featured = experience.filter((e) => e.featured).slice(0, 3)

  return (
    <Section id="experience">
      <Container>
        <SectionReveal>
          <div className="mb-10 text-center">
            <h2 className="mb-2">{t('sectionTitle')}</h2>
            <p className="mb-4 text-muted-foreground">{t('sectionSubtitle')}</p>
            <Link
              href={`/${locale}/experience`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('viewAll')}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </SectionReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((exp, i) => (
            <SectionReveal key={exp.id} delay={0.15 + i * 0.15} className="h-full">
              <ExperienceTeaserCard
                experience={exp}
                presentLabel={presentLabel}
                locale={locale}
              />
            </SectionReveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
