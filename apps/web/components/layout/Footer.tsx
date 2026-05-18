import { Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/icons'
import { Container } from './Container'

export async function Footer() {
  const t = await getTranslations('Footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year })} — {t('builtWith')}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/AmrMadkour"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-4" />
            </a>
            <a
              href="https://linkedin.com/in/amrmadkour"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <LinkedInIcon className="size-4" />
            </a>
            <a
              href="mailto:mismadkor14@gmail.com"
              aria-label="Email"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
