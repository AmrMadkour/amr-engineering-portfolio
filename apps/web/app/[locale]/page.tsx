import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Common')

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">{t('comingSoon')}</p>
    </main>
  )
}
