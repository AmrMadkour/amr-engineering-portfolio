'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavLinks } from './NavLinks'
import { LocaleSwitcher } from './LocaleSwitcher'

interface MobileMenuProps {
  locale: string
}

export function MobileMenu({ locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-border bg-background px-4 pb-4 pt-2">
          <NavLinks locale={locale} mobile onNavigate={() => setOpen(false)} />
          <div className="mt-3 border-t border-border pt-3">
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </div>
      )}
    </div>
  )
}
