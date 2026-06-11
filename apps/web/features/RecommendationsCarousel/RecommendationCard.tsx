import type { Recommendation } from '@/types/recommendation'
import { Card, CardContent } from '@/components/ui/card'

interface RecommendationCardProps {
  recommendation: Recommendation
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-6">
        <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{rec.text}&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          {/* Avatar with image or initials fallback */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            {rec.authorAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={rec.authorAvatarUrl}
                alt={rec.authorName}
                className="size-full rounded-full object-cover"
              />
            ) : (
              getInitials(rec.authorName)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{rec.authorName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {rec.authorTitle} @ {rec.authorCompany}
            </p>
          </div>
          {rec.source && (
            <span className="ms-auto shrink-0 text-xs text-muted-foreground">{rec.source}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
