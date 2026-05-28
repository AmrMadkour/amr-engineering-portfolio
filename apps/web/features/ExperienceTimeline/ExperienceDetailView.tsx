import Link from 'next/link'
import { ArrowLeft, User, Briefcase, ExternalLink, GitFork } from 'lucide-react'
import type { Experience } from '@/types/experience'
import type { Project } from '@/types/project'
import { Badge } from '@/components/ui/badge'
import { formatYearMonth } from '@/lib/formatDate'
import { SectionReveal } from '@/components/layout/SectionReveal'

interface Props {
  experience: Experience
  relatedProjects: Project[]
  presentLabel: string
  locale: string
}

const TYPE_LABEL: Record<string, string> = {
  personal:  'Personal Project',
  freelance: 'Freelance',
}

const TYPE_ACCENT: Record<string, string> = {
  company:   'from-violet-500/60 to-violet-500/0',
  personal:  'from-emerald-500/60 to-emerald-500/0',
  freelance: 'from-amber-500/60 to-amber-500/0',
}

export function ExperienceDetailView({ experience, relatedProjects, presentLabel, locale }: Props) {
  const startFormatted = formatYearMonth(experience.startDate, locale)
  const endFormatted = experience.endDate ? formatYearMonth(experience.endDate, locale) : presentLabel
  const isCompany = experience.type === 'company'

  return (
    <div className="mx-auto max-w-3xl">

      {/* Back link */}
      <Link
        href={`/${locale}/experience`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} strokeWidth={1.5} className="rtl:rotate-180" />
        All Experience
      </Link>

      {/* Header card */}
      <SectionReveal delay={0.05}>
      <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`h-1 w-full bg-gradient-to-r ${TYPE_ACCENT[experience.type]}`} />
        <div className="p-6">
          {isCompany ? (
            <>
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {experience.company}
              </p>
              <h1 className="mb-3 text-2xl font-bold text-foreground">{experience.role}</h1>
            </>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                {experience.type === 'personal'
                  ? <User size={14} strokeWidth={1.5} className="text-emerald-500" />
                  : <Briefcase size={14} strokeWidth={1.5} className="text-amber-500" />}
                <Badge
                  variant="outline"
                  className={
                    experience.type === 'personal'
                      ? 'text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }
                >
                  {TYPE_LABEL[experience.type]}
                </Badge>
              </div>
              <h1 className="mb-3 text-2xl font-bold text-foreground">
                {experience.description.split('.')[0]}
              </h1>
            </>
          )}

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {startFormatted} — {endFormatted}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Overview */}
      <SectionReveal delay={0.15}>
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Overview</h2>
        <p className="text-base text-foreground/80 leading-relaxed">{experience.description}</p>
      </div>
      </SectionReveal>

      {/* Highlights */}
      {experience.highlights.length > 0 && (
        <SectionReveal delay={0.25}>
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {isCompany ? 'Key Achievements' : 'What I Built'}
          </h2>
          <ul className="space-y-3">
            {experience.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/80">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>
        </SectionReveal>
      )}

      {/* Tech stack */}
      {experience.technologies.length > 0 && (
        <SectionReveal delay={0.1}>
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
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
        </div>
        </SectionReveal>
      )}

      {/* Related projects / use-cases */}
      {relatedProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {isCompany ? 'Projects & Use Cases' : 'What Was Delivered'}
          </h2>
          <div className="flex flex-col gap-3">
            {relatedProjects.map((project, i) => (
              <SectionReveal key={project.id} delay={i * 0.1}>
              <div
                className="rounded-xl border border-border bg-card/50 p-4 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/[0.03]"
              >
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/50 hover:text-foreground transition-colors"
                        aria-label="Live demo"
                      >
                        <ExternalLink size={13} strokeWidth={1.5} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/50 hover:text-foreground transition-colors"
                        aria-label="Repository"
                      >
                        <GitFork size={13} strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="mb-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-background/60 border-border/60 text-muted-foreground/70"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
