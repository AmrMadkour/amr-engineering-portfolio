'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function SectionReveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect user's motion preference — skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const alreadyVisible = el.getBoundingClientRect().top < window.innerHeight - 50

    if (alreadyVisible) {
      // Double-RAF: first frame paints opacity:0, second frame starts the transition
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          if (delay) el.style.transitionDelay = `${delay}s`
          el.classList.add('s-reveal--in')
        })
        return () => cancelAnimationFrame(raf2)
      })
      return () => cancelAnimationFrame(raf1)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        if (delay) el.style.transitionDelay = `${delay}s`
        el.classList.add('s-reveal--in')
        io.disconnect()
      },
      { rootMargin: '0px 0px 250px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  // s-reveal is in the initial render so CSS opacity:0 applies before any JS runs,
  // preventing the flash-of-content on hard refresh.
  return <div ref={ref} className={cn('s-reveal', className)}>{children}</div>
}
