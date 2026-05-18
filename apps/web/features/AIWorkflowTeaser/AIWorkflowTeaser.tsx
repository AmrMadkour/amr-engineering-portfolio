import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

interface AIWorkflowTeaserProps {
  locale: string
}

export async function AIWorkflowTeaser({ locale }: AIWorkflowTeaserProps) {
  const t = await getTranslations('AIWorkflow')

  return (
    <Section className="py-12 sm:py-16">
      <Container>
        <div className="rounded-xl border border-border bg-muted/40 px-8 py-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t('label')}
          </p>
          <h2 className="mb-3 text-2xl font-bold">{t('headline')}</h2>
          <p className="mb-6 max-w-2xl text-muted-foreground">{t('subtext')}</p>
          <Link
            href={`/${locale}/ai-workflow`}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
          >
            {t('cta')}
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
