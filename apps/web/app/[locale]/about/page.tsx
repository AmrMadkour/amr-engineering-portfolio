import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

const mdxPages = {
  en: () => import('@content/en/pages/about.mdx'),
  ar: () => import('@content/ar/pages/about.mdx'),
  nl: () => import('@content/nl/pages/about.mdx'),
} as const

type SupportedLocale = keyof typeof mdxPages

export default async function AboutPage({ params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const { default: Content } = await mdxPages[locale as SupportedLocale]()

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <Content />
      </article>
    </main>
  )
}
