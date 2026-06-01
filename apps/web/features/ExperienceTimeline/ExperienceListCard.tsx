import Link from 'next/link'
import { ArrowRight, Building2, User, Briefcase } from 'lucide-react'
import type { Experience } from '@/types/experience'
import { Badge } from '@/components/ui/badge'
import { formatYearMonth } from '@/lib/formatDate'

const TYPE_BADGE = {
  company:   { label: null,               icon: null,      className: '' },
  personal:  { label: 'Personal Project', icon: User,      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  freelance: { label: 'Freelance',        icon: Briefcase, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
}

function toCompleteSentences(text: string, maxSentences = 2): string {
  const parts = text.split(/\.\s+/)
  const taken = parts.slice(0, maxSentences).join('. ')
  return taken.endsWith('.') ? taken : taken + '.'
}

interface Props {
  experience: Experience
  presentLabel: string
  locale: string
  projectCount?: number
}

export function ExperienceListCard({ experience, presentLabel, locale, projectCount = 0 }: Props) {
  const startFormatted = formatYearMonth(experience.startDate, locale)
  const endFormatted = experience.endDate ? formatYearMonth(experience.endDate, locale) : presentLabel
  const badge = TYPE_BADGE[experience.type]

  return (
    <Link href={`/${locale}/experience/${experience.slug}`} className="group block">
      <div className="flex gap-5 rounded-xl border border-border bg-card px-5 py-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm">

        {/* Left — type indicator bar */}
        <div className="mt-1 flex flex-col items-center gap-1 shrink-0">
          {experience.type === 'company'
            ? <Building2 size={15} strokeWidth={1.5} className="text-muted-foreground/50" />
            : badge.icon
              ? <badge.icon size={15} strokeWidth={1.5} className="text-muted-foreground/50" />
              : null}
          <div className="mt-1 w-px flex-1 min-h-[2rem] bg-border/50" />
        </div>

        {/* Right — content */}
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {experience.type === 'company' ? (
              <>
                <span className="text-sm font-semibold text-foreground">{experience.role}</span>
                <span className="text-xs text-muted-foreground">@ {experience.company}</span>
              </>
            ) : (
              <Badge variant="outline" className={`text-xs ${badge.className}`}>
                {badge.label}
              </Badge>
            )}
          </div>

          {experience.type !== 'company' && (
            <p className="mb-1 text-sm font-medium text-foreground line-clamp-1">
              {experience.description.split('.')[0]}
            </p>
          )}

          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/60">
            {startFormatted} — {endFormatted}
            {projectCount > 0 && (
              <span className="ms-3 normal-case tracking-normal font-normal">
                · {projectCount} {projectCount === 1 ? 'project' : 'projects'}
              </span>
            )}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {toCompleteSentences(experience.description)}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {experience.technologies.slice(0, 8).map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-xs bg-primary/5 border-primary/15 text-primary/70"
                >
                  {tech}
                </Badge>
              ))}
              {experience.technologies.length > 8 && (
                <Badge variant="outline" className="text-xs bg-primary/5 border-primary/15 text-muted-foreground">
                  +{experience.technologies.length - 8}
                </Badge>
              )}
            </div>
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 rtl:rotate-180"
            />
          </div>
        </div>

      </div>
    </Link>
  )
}
