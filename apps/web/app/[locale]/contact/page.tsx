import { getTranslations } from 'next-intl/server'
import { Mail, ExternalLink, CalendarDays } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

type Props = { params: Promise<{ locale: string }> }

export default async function ContactPage({ params }: Props) {
  await params
  const t = await getTranslations('Contact')

  return (
    <main>
      <Section id="contact">
        <Container>
          <div className="mx-auto max-w-xl">
            <h1 className="mb-2 text-2xl font-bold text-foreground">{t('headline')}</h1>
            <p className="mb-10 text-muted-foreground">{t('subtext')}</p>

            <div className="flex flex-col gap-4">

              <a
                href="mailto:mismadkor14@gmail.com"
                className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail size={18} strokeWidth={1.5} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('ctaEmail')}</p>
                  <p className="text-xs text-muted-foreground">mismadkor14@gmail.com</p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/amrmadkour"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ExternalLink size={18} strokeWidth={1.5} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('ctaLinkedIn')}</p>
                  <p className="text-xs text-muted-foreground">linkedin.com/in/amrmadkour</p>
                </div>
              </a>

              <a
                href="https://cal.com/amrmadkour"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays size={18} strokeWidth={1.5} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('ctaBookMeeting')}</p>
                  <p className="text-xs text-muted-foreground">Schedule a 30-min intro call</p>
                </div>
              </a>

            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
