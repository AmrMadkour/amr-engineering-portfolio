import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleChatAction } from '@/features/ChatWidget/ChatActionHandler'
import type { Profile } from '@/types/profile'

const mockRouter = { push: vi.fn() }

const mockProfile: Profile = {
  name: 'Amr Madkour',
  title: 'Senior Software Engineer',
  bio: '',
  email: 'test@test.com',
  linkedInUrl: 'https://linkedin.com/in/amr',
  gitHubUrl: 'https://github.com/amr',
  schedulingUrl: 'https://cal.com/amr/30min',
  resumeUrl: '/amr-resume.pdf',
  skills: [],
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('open', vi.fn())
})

describe('handleChatAction — navigate_to_page', () => {
  it('does nothing when page is missing', () => {
    handleChatAction({ name: 'navigate_to_page', payload: {} }, mockRouter as never, 'en', mockProfile)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('navigates to experience slug', () => {
    handleChatAction(
      { name: 'navigate_to_page', payload: { page: 'experience', slug: 'metrixlab-senior' } },
      mockRouter as never, 'en', mockProfile,
    )
    expect(mockRouter.push).toHaveBeenCalledWith('/en/experience/metrixlab-senior')
  })

  it('navigates to experience with domain filter', () => {
    handleChatAction(
      { name: 'navigate_to_page', payload: { page: 'experience', domain: 'backend' } },
      mockRouter as never, 'en', mockProfile,
    )
    expect(mockRouter.push).toHaveBeenCalledWith('/en/experience?domain=backend')
  })

  it('navigates to home', () => {
    handleChatAction(
      { name: 'navigate_to_page', payload: { page: 'home' } },
      mockRouter as never, 'ar', mockProfile,
    )
    expect(mockRouter.push).toHaveBeenCalledWith('/ar')
  })

  it('navigates to a generic page', () => {
    handleChatAction(
      { name: 'navigate_to_page', payload: { page: 'contact' } },
      mockRouter as never, 'nl', mockProfile,
    )
    expect(mockRouter.push).toHaveBeenCalledWith('/nl/contact')
  })
})

describe('handleChatAction — window.open actions', () => {
  it('opens the scheduling URL for open_booking', () => {
    handleChatAction({ name: 'open_booking', payload: {} }, mockRouter as never, 'en', mockProfile)
    expect(window.open).toHaveBeenCalledWith('https://cal.com/amr/30min', '_blank', 'noopener,noreferrer')
  })

  it('opens LinkedIn for open_linkedin', () => {
    handleChatAction({ name: 'open_linkedin', payload: {} }, mockRouter as never, 'en', mockProfile)
    expect(window.open).toHaveBeenCalledWith('https://linkedin.com/in/amr', '_blank', 'noopener,noreferrer')
  })

  it('opens GitHub for open_github', () => {
    handleChatAction({ name: 'open_github', payload: {} }, mockRouter as never, 'en', mockProfile)
    expect(window.open).toHaveBeenCalledWith('https://github.com/amr', '_blank', 'noopener,noreferrer')
  })

  it('opens resume for download_resume', () => {
    handleChatAction({ name: 'download_resume', payload: {} }, mockRouter as never, 'en', mockProfile)
    expect(window.open).toHaveBeenCalledWith('/amr-resume.pdf', '_blank', 'noopener,noreferrer')
  })

  it('does not call window.open when schedulingUrl is null', () => {
    const noUrl = { ...mockProfile, schedulingUrl: null }
    handleChatAction({ name: 'open_booking', payload: {} }, mockRouter as never, 'en', noUrl)
    expect(window.open).not.toHaveBeenCalled()
  })
})
