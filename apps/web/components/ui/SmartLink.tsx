'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { smoothScrollTop } from '@/lib/smoothScrollTop'

interface Props {
  href: string
  children: React.ReactNode
  className?: string
}

export function SmartLink({ href, children, className }: Props) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={className}
      scroll={false}
      onClick={(e) => {
        if (pathname === href) {
          e.preventDefault()
          smoothScrollTop()
        }
      }}
    >
      {children}
    </Link>
  )
}
