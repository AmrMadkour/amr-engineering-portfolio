import type { Experience } from '@/types/experience'
import { Badge } from '@/components/ui/badge'

interface ExperienceCardProps {
  experience: Experience
  isLast?: boolean
  presentLabel: string
}

export function ExperienceCard({ experience, isLast = false, presentLabel }: ExperienceCardProps) {
  const endLabel = experience.endDate ?? presentLabel

  return (
    <div className="relative flex gap-6">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className="mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-foreground bg-background" />
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>

      {/* Content */}
      <div className={`pb-10 ${isLast ? 'pb-0' : ''}`}>
        <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold">{experience.role}</h3>
          <span className="text-sm text-muted-foreground">@ {experience.company}</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          {experience.startDate} — {endLabel}
        </p>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          {experience.description}
        </p>
        {experience.highlights.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {experience.highlights.map((highlight, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
        {experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {experience.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
