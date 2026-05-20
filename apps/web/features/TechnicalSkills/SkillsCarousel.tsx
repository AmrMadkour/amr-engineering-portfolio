'use client'

import { useState, useCallback } from 'react'
import type { SkillCategory } from '@/types/skills'
import { SkillCard } from './SkillCard'

interface SkillsCarouselProps {
  categories: SkillCategory[]
}

export function SkillsCarousel({ categories }: SkillsCarouselProps) {
  const [paused, setPaused] = useState(false)

  const pause = useCallback(() => setPaused(true), [])
  const resume = useCallback(() => setPaused(false), [])

  return (
    <div className="skills-carousel-outer">
      <div
        className="skills-track"
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
        aria-label="Technical skills carousel"
      >
        {categories.map((cat) => (
          <SkillCard
            key={cat.id}
            category={cat}
            onMouseEnter={pause}
            onMouseLeave={resume}
          />
        ))}
        {/* Duplicate for seamless infinite loop */}
        {categories.map((cat) => (
          <SkillCard
            key={`${cat.id}-dup`}
            category={cat}
            onMouseEnter={pause}
            onMouseLeave={resume}
          />
        ))}
      </div>
    </div>
  )
}
