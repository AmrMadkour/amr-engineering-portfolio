import Link from 'next/link'
import { Mail, CalendarDays, Download } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/icons'
import type { Profile } from '@/types/profile'

interface HeroSectionProps {
  profile: Profile
  locale: string
}

export async function HeroSection({ profile, locale }: HeroSectionProps) {
  const t = await getTranslations('Hero')

  return (
    <section className="hero-section">
      <div className="hero-grid">

        {/* ── Left / Text ── */}
        <div className="hero-text">
          <div className="hero-intro">
            <span className="hero-greeting">
              <span aria-hidden="true">👋</span>
              {t('greeting')}
            </span>
            <h1 className="hero-name">{profile.name}</h1>
          </div>

          <p className="hero-title">{profile.title}</p>

          <p className="hero-bio">{t('subtext')}</p>

          <div className="hero-ctas">
            <Link href={`/${locale}/projects`} className="hero-btn-primary">
              {t('ctaProjects')} →
            </Link>
            <Link href={`/${locale}/contact`} className="hero-btn-secondary">
              {t('ctaContact')}
            </Link>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download className="hero-btn-secondary">
                <Download size={16} strokeWidth={1.5} />
                {t('ctaResume')}
              </a>
            )}
          </div>

          <div className="hero-socials">
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-btn"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="size-5" />
              </a>
            )}
            {profile.gitHubUrl && (
              <a
                href={profile.gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-btn"
                aria-label="GitHub"
              >
                <GitHubIcon className="size-5" />
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="hero-social-btn"
              aria-label="Email"
            >
              <Mail size={20} strokeWidth={1.5} />
            </a>
            {profile.schedulingUrl && (
              <a
                href={profile.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-btn"
                aria-label="Book a meeting"
              >
                <CalendarDays size={20} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>

        {/* ── Right / Avatar ── */}
        <div className="hero-avatar-col">
          <div className="hero-avatar">
            <span className="hero-avatar-initials">AM</span>
          </div>
        </div>

      </div>
    </section>
  )
}
