'use client'

import type React from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, User, Briefcase } from 'lucide-react'
import type { Experience } from '@/types/experience'
import { Badge } from '@/components/ui/badge'
import { formatYearMonth } from '@/lib/formatDate'

const TYPE_CONFIG = {
  company:   { label: null,               icon: Building2, accent: 'from-violet-500/20 to-violet-500/5'  },
  personal:  { label: 'Personal Project', icon: User,      accent: 'from-emerald-500/20 to-emerald-500/5' },
  freelance: { label: 'Freelance',        icon: Briefcase, accent: 'from-amber-500/20 to-amber-500/5'    },
} satisfies Record<string, { label: string | null; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; accent: string }>

interface Props {
  experience: Experience
  presentLabel: string
  locale: string
}

export function ExperienceTeaserCard({ experience, presentLabel, locale }: Props) {
  const config = TYPE_CONFIG[experience.type]
  const startFormatted = formatYearMonth(experience.startDate, locale)
  const endFormatted = experience.endDate ? formatYearMonth(experience.endDate, locale) : presentLabel
  const TypeIcon = config.icon

  return (
    <Link href={`/${locale}/experience/${experience.slug}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">

        {/* Gradient top band */}
        <div className={`h-1 w-full bg-gradient-to-r ${config.accent.replace('/20', '/60').replace('/5', '/0')}`} />

        {/* Background gradient wash */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none`} />

        <div className="relative p-6 flex flex-col h-full">

          {/* Header row */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {experience.type === 'company' ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    {experience.company}
                  </p>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {experience.role}
                  </h3>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 mb-1">
                    <TypeIcon size={13} strokeWidth={2} className="text-muted-foreground" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {config.label}
                    </p>
                  </div>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {experience.description.split('.')[0]}
                  </h3>
                </>
              )}
            </div>
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="mt-1 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 rtl:rotate-180"
            />
          </div>

          {/* Duration */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
            {startFormatted} — {endFormatted}
          </p>

          {/* Summary */}
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {experience.description}
          </p>

          {/* Key tech chips — top 4 only */}
          <div className="flex flex-wrap gap-1.5">
            {experience.technologies.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs bg-background/60 border-border/60 text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
            {experience.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs bg-background/60 border-border/60 text-muted-foreground">
                +{experience.technologies.length - 4}
              </Badge>
            )}
          </div>

        </div>
      </div>
    </Link>
  )
}
