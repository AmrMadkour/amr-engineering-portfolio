import { getProfile } from '@/services/profile'
import { HeroSection } from '@/features/Hero/HeroSection'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const profile = await getProfile(locale)

  return (
    <main>
      <HeroSection profile={profile} locale={locale} />
    </main>
  )
}
