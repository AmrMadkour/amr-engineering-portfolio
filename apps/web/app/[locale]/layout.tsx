import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { PageTransition } from '@/components/layout/PageTransition'
import { ScrollRestoration } from '@/components/layout/ScrollRestoration'
import { FooterSection } from '@/features/Footer/FooterSection'
import { ChatWidgetLoader } from '@/features/ChatWidget/ChatWidgetLoader'
import { CookieNotice } from '@/components/layout/CookieNotice'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { routing } from '@/i18n/routing'
import '../globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: ({ ar: 'ar_EG', nl: 'nl_NL' } as Record<string, string>)[locale] ?? 'en_US',
      type: 'website',
    },
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
        nl: `${siteUrl}/nl`,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body className={`${outfit.variable} font-sans antialiased`}>
        {/* Ensure sections are visible when JS is disabled */}
        <noscript><style>{`.s-reveal { opacity: 1 !important; transform: none !important; }`}</style></noscript>
        <PersonJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ScrollRestoration />
            <Navbar locale={locale} />
            <div className="page-body"><PageTransition>{children}</PageTransition></div>
            <FooterSection locale={locale} />
            <ChatWidgetLoader locale={locale} />
            <CookieNotice />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
