'use client'

import { motion } from 'framer-motion'
import type { Experience } from '@/types/experience'
import type { Project } from '@/types/project'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceAnimatedListProps {
  experience: Experience[]
  presentLabel: string
  relatedProjectsMap: Record<string, Project[]>
  locale: string
}

export function ExperienceAnimatedList({ experience, presentLabel, relatedProjectsMap, locale }: ExperienceAnimatedListProps) {
  return (
    <div>
      {experience.map((exp, i) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
        >
          <ExperienceCard
            experience={exp}
            presentLabel={presentLabel}
            isLast={i === experience.length - 1}
            relatedProjects={relatedProjectsMap[exp.id] ?? []}
            locale={locale}
          />
        </motion.div>
      ))}
    </div>
  )
}
