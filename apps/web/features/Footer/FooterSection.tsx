import Image from 'next/image'
import { Mail, CalendarDays } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getProfile } from '@/services/profile'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/icons'
import { SmartLink } from '@/components/ui/SmartLink'

interface Props {
  locale: string
}

export async function FooterSection({ locale }: Props) {
  const profile = await getProfile(locale)
  const t = await getTranslations('Footer')
  const tNav = await getTranslations('Navigation')
  const year = new Date().getFullYear()

  return (
    <footer className="footer-root">
      <div className="footer-inner">

        <div className="footer-identity">
          <Image
            src="/amr-madkour-2.jpg"
            alt={profile.name}
            width={88}
            height={88}
            className="footer-avatar"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <p className="footer-name">{profile.name}</p>
          <p className="footer-tagline">{profile.title}</p>
          <p className="footer-passion">{t('passion')}</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-label">{t('quickLinks')}</p>
            <SmartLink href={`/${locale}/experience`} className="footer-col-value">
              {tNav('experience')}
            </SmartLink>
            <SmartLink href={`/${locale}/contact`} className="footer-col-value">
              {tNav('contact')}
            </SmartLink>
          </div>

          <div className="footer-vdivider" />

          <div className="footer-col">
            <p className="footer-col-label">{t('connect')}</p>
            <div className="footer-socials">
              {profile.linkedInUrl && (
                <a
                  href={profile.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="footer-social-btn"
                >
                  <LinkedInIcon className="size-4" />
                </a>
              )}
              {profile.gitHubUrl && (
                <a
                  href={profile.gitHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="footer-social-btn"
                >
                  <GitHubIcon className="size-4" />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="footer-social-btn"
              >
                <Mail size={16} strokeWidth={1.5} />
              </a>
              {profile.schedulingUrl && (
                <a
                  href={profile.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Book a meeting"
                  className="footer-social-btn"
                >
                  <CalendarDays size={16} strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} {profile.name}. {t('allRightsReserved')}
          </p>
          <div className="footer-legal-links">
            <SmartLink href={`/${locale}/privacy-policy`}>{t('privacyPolicy')}</SmartLink>
          </div>
        </div>

      </div>
    </footer>
  )
}
