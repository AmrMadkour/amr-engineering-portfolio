'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { House, User, Briefcase, FolderOpen, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { key: 'home', href: '/', icon: House },
  { key: 'projects', href: '/projects', icon: FolderOpen },
  { key: 'experience', href: '/experience', icon: Briefcase },
  { key: 'about', href: '/about', icon: User },
  { key: 'contact', href: '/contact', icon: Mail },
] as const

interface NavLinksProps {
  locale: string
  mobile?: boolean
  iconOnly?: boolean
  onNavigate?: () => void
}

export function NavLinks({ locale, mobile = false, iconOnly = false, onNavigate }: NavLinksProps) {
  const pathname = usePathname()
  const t = useTranslations('Navigation')

  return (
    <nav className={cn('flex', mobile && 'flex-col gap-1', !mobile && iconOnly && 'items-center gap-0.5', !mobile && !iconOnly && 'items-center gap-6')}>
      {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
        const fullHref = href === '/' ? `/${locale}` : `/${locale}${href}`
        const isActive =
          href === '/'
            ? pathname === `/${locale}` || pathname === `/${locale}/`
            : pathname === fullHref || pathname.startsWith(`${fullHref}/`)

        if (iconOnly) {
          return (
            <Link
              key={key}
              href={fullHref}
              onClick={onNavigate}
              title={t(key)}
              aria-label={t(key)}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-md transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
            </Link>
          )
        }

        if (mobile) {
          return (
            <Link
              key={key}
              href={fullHref}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              {t(key)}
            </Link>
          )
        }

        return (
          <Link
            key={key}
            href={fullHref}
            onClick={onNavigate}
            className={cn(
              'text-sm transition-colors',
              isActive
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t(key)}
          </Link>
        )
      })}
    </nav>
  )
}
