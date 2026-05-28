'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { smoothScrollTop } from '@/lib/smoothScrollTop'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    smoothScrollTop()
  }, [pathname])

  return (
    <div key={pathname} className="page-transition-enter">
      {children}
    </div>
  )
}
