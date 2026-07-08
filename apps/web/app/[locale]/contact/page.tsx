import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Mail, CalendarDays, MapPin } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionReveal } from '@/components/layout/SectionReveal'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/icons'
import { getProfile } from '@/services/profile'
import { buildAlternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: `Contact — ${t('title')}`,
    description: 'Get in touch with Amr Madkour — open to senior engineering roles, technical consulting, and architecture reviews.',
    alternates: buildAlternates(locale, '/contact'),
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const [t, profile] = await Promise.all([
    getTranslations('Contact'),
    getProfile(locale),
  ])

  return (
    <main>
      <Section id="contact">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-stretch">

            {/* Left: heading + cards */}
            <div>
              <h1 className="mb-2 text-2xl font-bold text-foreground page-head">{t('headline')}</h1>
              <p className="mb-10 text-muted-foreground page-subhead">{t('subtext')}</p>

              <div className="flex flex-col gap-4">

                <SectionReveal delay={0.1}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.02]"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                      <Mail size={18} strokeWidth={1.5} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t('ctaEmail')}</p>
                      <p className="text-xs text-muted-foreground">{t('ctaEmailSub')}</p>
                    </div>
                  </a>
                </SectionReveal>

                {profile.linkedInUrl && (
                  <SectionReveal delay={0.2}>
                    <a
                      href={profile.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-blue-500/30 hover:bg-blue-500/[0.02]"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                        <LinkedInIcon className="text-blue-600 dark:text-blue-400 text-[18px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t('ctaLinkedIn')}</p>
                        <p className="text-xs text-muted-foreground">Connect on LinkedIn</p>
                      </div>
                    </a>
                  </SectionReveal>
                )}

                {profile.gitHubUrl && (
                  <SectionReveal delay={0.3}>
                    <a
                      href={profile.gitHubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-slate-500/30 hover:bg-slate-500/[0.02]"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-500/10">
                        <GitHubIcon className="text-slate-700 dark:text-slate-300 text-[18px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t('ctaGitHub')}</p>
                        <p className="text-xs text-muted-foreground">{profile.gitHubUrl.replace('https://', '')}</p>
                      </div>
                    </a>
                  </SectionReveal>
                )}

                {profile.schedulingUrl && (
                  <SectionReveal delay={0.4}>
                    <a
                      href={profile.schedulingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                        <CalendarDays size={18} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t('ctaBookMeeting')}</p>
                        <p className="text-xs text-muted-foreground">Schedule a 30-min intro call</p>
                      </div>
                    </a>
                  </SectionReveal>
                )}

                <SectionReveal delay={0.5}>
                  <a
                    href="https://maps.google.com/?q=Schiedam,+Netherlands"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.02]"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                      <MapPin size={18} strokeWidth={1.5} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t('ctaLocation')}</p>
                      <p className="text-xs text-muted-foreground">Open in Google Maps</p>
                    </div>
                  </a>
                </SectionReveal>

              </div>
            </div>

            {/* Right: photo */}
            <SectionReveal delay={0.2} className="lg:h-full">
              <div className="relative w-full overflow-hidden rounded-2xl aspect-[447/515] lg:aspect-auto lg:h-full">
                <Image
                  src="/amr-madkour.jpg"
                  alt={profile.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={95}
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/70">
                    {profile.title}
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {profile.name}
                  </h2>
                </div>
              </div>
            </SectionReveal>

          </div>
        </Container>
      </Section>
    </main>
  )
}
