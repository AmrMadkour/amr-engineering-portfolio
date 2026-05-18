'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { routing } from '@/i18n/routing'

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ar: 'AR',
  nl: 'NL',
}

interface LocaleSwitcherProps {
  currentLocale: string
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // Replace the locale segment in the current pathname
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1">
      <Globe className="size-3.5 text-muted-foreground" />
      {routing.locales.map((locale) => (
        <Button
          key={locale}
          variant="ghost"
          size="sm"
          onClick={() => switchLocale(locale)}
          className={
            locale === currentLocale
              ? 'h-7 px-2 text-xs font-semibold text-foreground'
              : 'h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
          }
        >
          {LOCALE_LABELS[locale]}
        </Button>
      ))}
    </div>
  )
}
