import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CookieNotice } from '@/components/layout/CookieNotice'

// next-intl mocks
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => ({
    ariaLabel: 'Cookie notice',
    message: 'This site uses a functional cookie.',
    policyLink: 'Privacy Policy',
    dismiss: 'Got it',
  }[key] ?? key),
  useLocale: () => 'en',
}))

// next/link mock
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const STORAGE_KEY = 'cookie-notice-ack'

describe('CookieNotice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the banner when localStorage key is absent', () => {
    render(<CookieNotice />)
    expect(screen.getByRole('region', { name: 'Cookie notice' })).toBeInTheDocument()
    expect(screen.getByText('This site uses a functional cookie.')).toBeInTheDocument()
    expect(screen.getByText('Got it')).toBeInTheDocument()
  })

  it('does not render when already acknowledged', () => {
    localStorage.setItem(STORAGE_KEY, '1')
    render(<CookieNotice />)
    expect(screen.queryByRole('region', { name: 'Cookie notice' })).not.toBeInTheDocument()
  })

  it('hides the banner and sets localStorage on dismiss', () => {
    render(<CookieNotice />)
    fireEvent.click(screen.getByText('Got it'))
    expect(screen.queryByRole('region', { name: 'Cookie notice' })).not.toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1')
  })

  it('renders the Privacy Policy link pointing to the privacy policy page', () => {
    render(<CookieNotice />)
    const link = screen.getByText('Privacy Policy')
    expect(link.closest('a')).toHaveAttribute('href', '/en/privacy-policy')
  })
})
