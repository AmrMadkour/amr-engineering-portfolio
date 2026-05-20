'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/types/project'
import { ProjectCard } from './ProjectCard'

interface Labels {
  featured: string
  viewLive: string
  viewRepo: string
  present: string
}

interface ProjectsAnimatedGridProps {
  projects: Project[]
  labels: Labels
}

export function ProjectsAnimatedGrid({ projects, labels }: ProjectsAnimatedGridProps) {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
        >
          <ProjectCard project={project} labels={labels} />
        </motion.div>
      ))}
    </div>
  )
}
