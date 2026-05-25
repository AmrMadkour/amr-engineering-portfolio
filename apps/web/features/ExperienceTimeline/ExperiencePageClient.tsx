'use client'

import { useState, useMemo } from 'react'
import type { Experience } from '@/types/experience'
import type { Project } from '@/types/project'
import { ExperienceFilterBar, type ExperienceFilter } from './ExperienceFilterBar'
import { ExperienceListCard } from './ExperienceListCard'

interface Props {
  experience: Experience[]
  projects: Project[]
  presentLabel: string
  locale: string
}

const KEY_TECHS = [
  '.NET', 'C#', 'Next.js', 'TypeScript', 'React',
  'Azure', 'Docker', 'Kubernetes', 'SQL Server', 'PostgreSQL',
]

function extractYear(dateStr: string) {
  return dateStr.split('-')[0]
}

export function ExperiencePageClient({ experience, projects, presentLabel, locale }: Props) {
  const [filter, setFilter] = useState<ExperienceFilter>({ type: 'all', tech: null, year: null })

  const availableTechs = useMemo(() => {
    const all = new Set(experience.flatMap((e) => e.technologies))
    return KEY_TECHS.filter((t) => all.has(t))
  }, [experience])

  const availableYears = useMemo(() => {
    const years = new Set(experience.map((e) => extractYear(e.startDate)))
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [experience])

  const projectCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of projects) {
      if (p.experienceId) map[p.experienceId] = (map[p.experienceId] ?? 0) + 1
    }
    return map
  }, [projects])

  const filtered = useMemo(() => {
    return experience.filter((e) => {
      if (filter.type !== 'all' && e.type !== filter.type) return false
      if (filter.tech && !e.technologies.includes(filter.tech)) return false
      if (filter.year && extractYear(e.startDate) !== filter.year) return false
      return true
    })
  }, [experience, filter])

  return (
    <>
      <ExperienceFilterBar
        filter={filter}
        onChange={setFilter}
        availableTechs={availableTechs}
        availableYears={availableYears}
        resultCount={filtered.length}
        totalCount={experience.length}
      />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No results for this filter.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((exp) => (
            <ExperienceListCard
              key={exp.id}
              experience={exp}
              presentLabel={presentLabel}
              locale={locale}
              projectCount={projectCountMap[exp.id] ?? 0}
            />
          ))}
        </div>
      )}
    </>
  )
}
