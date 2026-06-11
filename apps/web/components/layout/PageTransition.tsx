'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { smoothScrollTop } from '@/lib/smoothScrollTop'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    smoothScrollTop()
  }, [pathname])

  return (
    <div key={pathname} className="page-transition-enter">
      {children}
    </div>
  )
}
