import { ExternalLink } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/icons'
import type { Project } from '@/types/project'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">{project.title}</h3>
          {project.featured && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {labels.featured}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {project.startDate}{project.endDate ? ` — ${project.endDate}` : ` — ${labels.present}`}
        </p>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </CardContent>
      <CardContent className="pt-0 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      {(project.liveUrl || project.repoUrl) && (
        <CardFooter className="gap-2 pt-0">
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
                <GitHubIcon className="size-3.5" />
                {labels.viewRepo}
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
