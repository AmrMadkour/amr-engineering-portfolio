import { getProfile } from '@/services/profile'
import { ChatWidget } from './ChatWidget'

interface Props {
  locale: string
}

export async function ChatWidgetLoader({ locale }: Props) {
  try {
    const profile = await getProfile(locale)
    return <ChatWidget profile={profile} />
  } catch {
    // If profile fetch fails, don't render the widget at all
    return null
  }
}
