import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

type Props = { params: Promise<{ locale: string }> }

export default async function SitemapPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('Footer')
  const tNav = await getTranslations('Navigation')

  const links = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('experience'), href: `/${locale}/experience` },
    { label: tNav('contact'), href: `/${locale}/contact` },
    { label: t('privacyPolicy'), href: `/${locale}/privacy-policy` },
  ]

  return (
    <main>
      <Section id="sitemap">
        <Container>
          <div className="mx-auto max-w-2xl py-16">
            <h1 className="mb-8 text-3xl font-bold text-foreground">{t('sitemap')}</h1>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg text-muted-foreground hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </main>
  )
}
