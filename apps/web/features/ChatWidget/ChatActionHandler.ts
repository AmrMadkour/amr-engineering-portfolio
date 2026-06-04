import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { Profile } from '@/types/profile'
import type { ChatAction } from './useChatStream'

export function handleChatAction(
  action: ChatAction,
  router: AppRouterInstance,
  locale: string,
  profile: Profile,
) {
  switch (action.name) {
    case 'navigate_to_page': {
      const { page, slug, domain } = action.payload as { page?: string; slug?: string; domain?: string }
      if (!page) return
      if (slug) {
        router.push(`/${locale}/experience/${slug}`)
      } else if (page === 'experience' && domain) {
        router.push(`/${locale}/experience?domain=${domain}`)
      } else if (page === 'home') {
        router.push(`/${locale}`)
      } else {
        router.push(`/${locale}/${page}`)
      }
      break
    }
    case 'open_booking':
      if (profile.schedulingUrl) window.open(profile.schedulingUrl, '_blank', 'noopener,noreferrer')
      break
    case 'open_linkedin':
      if (profile.linkedInUrl) window.open(profile.linkedInUrl, '_blank', 'noopener,noreferrer')
      break
    case 'open_github':
      if (profile.gitHubUrl) window.open(profile.gitHubUrl, '_blank', 'noopener,noreferrer')
      break
    case 'download_resume':
      if (profile.resumeUrl) window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer')
      break
  }
}
