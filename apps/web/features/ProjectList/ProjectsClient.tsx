'use client'

import { useState, useMemo } from 'react'
import type { Project } from '@/types/project'
import { ProjectCard } from './ProjectCard'
import { TagFilter } from './TagFilter'

interface Labels {
  featured: string
  viewLive: string
  viewRepo: string
  present: string
  filterAll: string
}

interface ProjectsClientProps {
  projects: Project[]
  labels: Labels
  experienceLookup?: Record<string, string>
}

export function ProjectsClient({ projects, labels, experienceLookup = {} }: ProjectsClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tags = new Set(projects.flatMap((p) => p.tags))
    return Array.from(tags).sort()
  }, [projects])

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  return (
    <div className="space-y-8">
      <TagFilter tags={allTags} activeTag={activeTag} onChange={setActiveTag} filterAllLabel={labels.filterAll} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            labels={labels}
            experienceCompany={project.experienceId ? experienceLookup[project.experienceId] : undefined}
          />
        ))}
      </div>
    </div>
  )
}
