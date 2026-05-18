import { Mail, CalendarDays } from 'lucide-react'
import { LinkedInIcon } from '@/components/ui/icons'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

export async function ContactCTA() {
  const t = await getTranslations('Contact')

  return (
    <Section id="contact" className="py-20 sm:py-28">
      <Container>
        <div className="text-center">
          <h2 className="mb-4">{t('headline')}</h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">{t('subtext')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="mailto:mismadkor14@gmail.com">
                <Mail className="size-4" />
                {t('ctaEmail')}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://linkedin.com/in/amrmadkour"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon className="size-4" />
                {t('ctaLinkedIn')}
              </a>
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
          </div>
        </div>
      </Container>
    </Section>
  )
}
