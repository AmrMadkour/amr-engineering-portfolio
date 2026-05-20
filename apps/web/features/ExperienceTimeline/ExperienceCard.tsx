import type { Experience } from '@/types/experience'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

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
        <div className="mt-5 size-3 shrink-0 rounded-full border-2 border-primary bg-background ring-4 ring-primary/10" />
        {!isLast && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-primary/40 to-border/40" />}
      </div>

      {/* Content card */}
      <div className={`pb-8 min-w-0 flex-1 ${isLast ? 'pb-0' : ''}`}>
        <Card className="overflow-hidden">
          <div className="h-[2px] w-full bg-gradient-to-r from-primary/60 to-transparent" />
          <CardContent className="p-5">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <h3 className="text-base font-semibold text-foreground">{experience.role}</h3>
              <Badge className="bg-primary/10 text-primary border-primary/25 hover:bg-primary/15 text-xs font-normal">
                {experience.company}
              </Badge>
            </div>
            <p className="mb-4 text-xs text-muted-foreground font-medium tracking-wide uppercase">
              {experience.startDate} — {endLabel}
            </p>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              {experience.description}
            </p>
            {experience.highlights.length > 0 && (
              <ul className="mb-4 space-y-2">
                {experience.highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary/60" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
            {experience.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {experience.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs bg-primary/5 border-primary/20 text-primary/80"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
