import { Quote } from 'lucide-react'
import type { Recommendation } from '@/types/recommendation'
import { SectionReveal } from '@/components/layout/SectionReveal'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface Props {
  recommendations: Recommendation[]
}

export function RecommendationsGrid({ recommendations }: Props) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec, i) => (
        <SectionReveal key={rec.id} delay={0.15 + i * 0.15} className="h-full">
          <div className="rec-card h-full">
            <Quote className="rec-card-icon" aria-hidden="true" />

            <p className="rec-card-quote">{rec.text}</p>

            <div className="rec-card-footer">
              <div className="rec-card-avatar">
                {rec.authorAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rec.authorAvatarUrl}
                    alt={rec.authorName}
                    className="size-full object-cover"
                  />
                ) : (
                  getInitials(rec.authorName)
                )}
              </div>
              <div>
                <p className="rec-card-name">{rec.authorName}</p>
                <p className="rec-card-meta">
                  {rec.authorTitle}
                  {rec.authorCompany ? ` · ${rec.authorCompany}` : ''}
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      ))}
    </div>
  )
}
