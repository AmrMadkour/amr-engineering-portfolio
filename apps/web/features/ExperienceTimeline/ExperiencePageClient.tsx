'use client'

import { useState, useMemo } from 'react'
import type { Experience } from '@/types/experience'
import type { Project } from '@/types/project'
import { ExperienceFilterBar, type ExperienceFilter } from './ExperienceFilterBar'
import { ExperienceListCard } from './ExperienceListCard'
import { SectionReveal } from '@/components/layout/SectionReveal'

interface Props {
  experience: Experience[]
  projects: Project[]
  presentLabel: string
  locale: string
}

const DOMAIN_ORDER = ['backend', 'fullstack', 'cloud', 'frontend']

function getEra(startDate: string): string {
  const year = parseInt(startDate.slice(0, 4))
  if (year <= 2019) return 'early'
  if (year <= 2022) return 'mid'
  return 'recent'
}

export function ExperiencePageClient({ experience, projects, presentLabel, locale }: Props) {
  const [filter, setFilter] = useState<ExperienceFilter>({ type: 'all', domain: null, era: null })

  const availableDomains = useMemo(() => {
    const present = new Set(experience.map((e) => e.domain).filter(Boolean))
    return DOMAIN_ORDER.filter((d) => present.has(d))
  }, [experience])

  const availableEras = useMemo(() => {
    const present = new Set(experience.map((e) => getEra(e.startDate)))
    return (['early', 'mid', 'recent'] as const).filter((era) => present.has(era))
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
      if (filter.domain && e.domain !== filter.domain) return false
      if (filter.era && getEra(e.startDate) !== filter.era) return false
      return true
    })
  }, [experience, filter])

  return (
    <>
      <ExperienceFilterBar
        filter={filter}
        onChange={setFilter}
        availableDomains={availableDomains}
        availableEras={availableEras}
        resultCount={filtered.length}
        totalCount={experience.length}
      />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No results for this filter.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((exp, i) => (
            <SectionReveal key={exp.id} delay={Math.min(i * 0.1, 0.5)}>
              <ExperienceListCard
                experience={exp}
                presentLabel={presentLabel}
                locale={locale}
                projectCount={projectCountMap[exp.id] ?? 0}
              />
            </SectionReveal>
          ))}
        </div>
      )}
    </>
  )
}
