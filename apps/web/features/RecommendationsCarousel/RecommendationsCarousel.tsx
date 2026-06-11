'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Recommendation } from '@/types/recommendation'
import { Button } from '@/components/ui/button'

interface RecommendationsCarouselProps {
  recommendations: Recommendation[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function RecommendationsCarousel({ recommendations }: RecommendationsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setActiveIndex(index)
  }, [])

  const prev = useCallback(() => {
    goTo((activeIndex - 1 + recommendations.length) % recommendations.length, -1)
  }, [activeIndex, recommendations.length, goTo])

  const next = useCallback(() => {
    goTo((activeIndex + 1) % recommendations.length, 1)
  }, [activeIndex, recommendations.length, goTo])

  useEffect(() => {
    if (isPaused || recommendations.length <= 1) return
    const id = setInterval(() => {
      setDirection(1)
      setActiveIndex((i) => (i + 1) % recommendations.length)
    }, 5000)
    return () => clearInterval(id)
  }, [isPaused, recommendations.length])

  if (recommendations.length === 0) return null

  const rec = recommendations[activeIndex]
  if (!rec) return null

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  }

  return (
    <div
      className="rec-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Avatar stack */}
      <div className="rec-avatar-stack">
        {recommendations.map((r, i) => (
          <button
            key={r.id}
            onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
            className={`rec-avatar-btn ${i === activeIndex ? 'rec-avatar-active' : ''}`}
            style={{ zIndex: recommendations.length - i }}
            aria-label={`Go to ${r.authorName}`}
          >
            {r.authorAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.authorAvatarUrl} alt={r.authorName} className="size-full rounded-full object-cover" />
            ) : (
              getInitials(r.authorName)
            )}
          </button>
        ))}
        <span className="ms-3 text-sm text-muted-foreground">Trusted by industry leaders</span>
      </div>

      {/* Quote area */}
      <div className="rec-quote-area">
        {/* Decorative quote mark */}
        <span className="rec-quote-mark">&ldquo;</span>

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="rec-quote-text">
              {rec.text}
            </blockquote>
            <div className="rec-author">
              <div className="rec-author-avatar">
                {rec.authorAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rec.authorAvatarUrl} alt={rec.authorName} className="size-full rounded-full object-cover" />
                ) : (
                  getInitials(rec.authorName)
                )}
              </div>
              <div>
                <p className="rec-author-name">{rec.authorName}</p>
                <p className="rec-author-meta">
                  {rec.authorTitle}
                  {rec.authorCompany ? ` @ ${rec.authorCompany}` : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="rec-controls">
        {/* Dot navigation */}
        <div className="rec-dots">
          {recommendations.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
              className={`rec-dot ${i === activeIndex ? 'rec-dot-active' : ''}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        {recommendations.length > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Previous">
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </Button>
            <Button variant="outline" size="icon" onClick={next} aria-label="Next">
              <ChevronRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
