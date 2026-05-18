import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/ui/icons'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

interface HeroSectionProps {
  locale: string
}

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations('Hero')

  return (
    <Section className="py-20 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {t('credentialLabel')}
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t('headline')}
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            {t('subtext')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/${locale}/projects`}>{t('ctaProjects')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://cal.com/amr-madkour/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarDays className="size-4" />
                {t('ctaBookMeeting')}
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a
                href="https://github.com/AmrMadkour"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" />
                {t('ctaGitHub')}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
