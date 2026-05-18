import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Experience } from '@/types/experience'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceSectionProps {
  experience: Experience[]
  locale: string
  preview?: boolean
}

export async function ExperienceSection({ experience, locale, preview = false }: ExperienceSectionProps) {
  const t = await getTranslations('Experience')

  const displayed = preview ? experience.slice(0, 2) : experience
  const presentLabel = t('present')

  return (
    <Section id="experience">
      <Container>
        <div className="mb-10">
          <h2 className="mb-2">{t('sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('sectionSubtitle')}</p>
        </div>

        <div>
          {displayed.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              presentLabel={presentLabel}
              isLast={i === displayed.length - 1 && (!preview || experience.length <= 2)}
            />
          ))}
        </div>

        {preview && experience.length > 2 && (
          <div className="mt-6">
            <Link
              href={`/${locale}/experience`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('viewAll')}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </div>
        )}
      </Container>
    </Section>
  )
}
