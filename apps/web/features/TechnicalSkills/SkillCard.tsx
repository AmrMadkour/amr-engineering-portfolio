'use client'

import {
  Server,
  MonitorSmartphone,
  Database,
  Cloud,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SkillCategory } from '@/types/skills'
import { SkillIcon } from './SkillIcon'

const CATEGORY_META: Record<string, { icon: LucideIcon; gradient: string; accent: string }> = {
  backend:  { icon: Server,          gradient: 'from-violet-600/20 to-violet-500/5',  accent: '#7C3AED' },
  frontend: { icon: MonitorSmartphone, gradient: 'from-blue-600/20 to-blue-500/5',   accent: '#2563EB' },
  databases:{ icon: Database,        gradient: 'from-orange-600/20 to-orange-500/5', accent: '#EA580C' },
  devops:   { icon: Cloud,           gradient: 'from-sky-600/20 to-sky-500/5',        accent: '#0284C7' },
  quality:  { icon: ShieldCheck,     gradient: 'from-emerald-600/20 to-emerald-500/5', accent: '#059669' },
}

interface SkillCardProps {
  category: SkillCategory
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function SkillCard({ category, onMouseEnter, onMouseLeave }: SkillCardProps) {
  const meta = CATEGORY_META[category.id] ?? {
    icon: Server,
    gradient: 'from-violet-600/20 to-violet-500/5',
    accent: '#7C3AED',
  }
  const Icon = meta.icon

  return (
    <div
      className="skill-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`skill-card-header bg-gradient-to-br ${meta.gradient}`}>
        <div className="skill-card-header-icon" style={{ color: meta.accent }}>
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <h3 className="skill-card-title">{category.title}</h3>
        <span className="skill-card-count">{category.skills.length}</span>
      </div>
      <div className="skill-card-body">
        {category.skills.map((skill) => (
          <SkillIcon key={skill} name={skill} size={20} />
        ))}
      </div>
    </div>
  )
}
