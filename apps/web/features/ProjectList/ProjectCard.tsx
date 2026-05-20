import { ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import type { Project } from '@/types/project'
import { Button } from '@/components/ui/button'
import { TechBadge } from '@/components/ui/tech-badge'

interface ProjectCardProps {
  project: Project
  labels: {
    featured: string
    viewLive: string
    viewRepo: string
    present: string
  }
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
  return (
    <div className="project-card flex flex-col gap-5 rounded-2xl border border-border bg-card p-7">
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold leading-tight text-foreground">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <TechBadge key={tag} name={tag} />
        ))}
      </div>

      {(project.liveUrl || project.repoUrl) && (
        <div className="flex gap-2 pt-1">
          {project.liveUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                {labels.viewLive}
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button asChild variant="ghost" size="sm">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <SiGithub size={14} />
                {labels.viewRepo}
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
