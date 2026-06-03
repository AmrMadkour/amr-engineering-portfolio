'use client'

import { useEffect, useRef } from 'react'

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

    // Already visible on load — skip animation entirely
    if (el.getBoundingClientRect().top < window.innerHeight - 72) return

    el.classList.add('s-reveal')

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        if (delay) el.style.transitionDelay = `${delay}s`
        el.classList.add('s-reveal--in')
        io.disconnect()
      },
      { rootMargin: '-72px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return <div ref={ref} className={className}>{children}</div>
}
