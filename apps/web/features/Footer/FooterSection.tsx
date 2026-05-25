import { CalendarDays } from 'lucide-react'
import { getProfile } from '@/services/profile'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/icons'

interface Props {
  locale: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export async function FooterSection({ locale }: Props) {
  const profile = await getProfile(locale)
  const year = new Date().getFullYear()

  return (
    <footer className="footer-root">
      <div className="footer-inner">

        <div className="footer-identity">
          <div className="footer-avatar">{getInitials(profile.name)}</div>
          <p className="footer-name">{profile.name}</p>
          <p className="footer-tagline">{profile.title}</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-label">Schedule a call</p>
            <a
              href="https://cal.com/amrmadkour"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-col-value"
            >
              cal.com/amrmadkour
            </a>
          </div>

          <div className="footer-vdivider" />

          <div className="footer-col">
            <p className="footer-col-label">Email me at</p>
            <a href={`mailto:${profile.email}`} className="footer-col-value">
              {profile.email}
            </a>
          </div>

          <div className="footer-vdivider" />

          <div className="footer-col">
            <p className="footer-col-label">Follow me on</p>
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
                href="https://cal.com/amrmadkour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Schedule a call"
                className="footer-social-btn"
              >
                <CalendarDays className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} {profile.name}. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
