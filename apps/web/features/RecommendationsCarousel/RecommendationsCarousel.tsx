'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Recommendation } from '@/types/recommendation'
import { Button } from '@/components/ui/button'
import { RecommendationCard } from './RecommendationCard'

interface RecommendationsCarouselProps {
  recommendations: Recommendation[]
}

export function RecommendationsCarousel({ recommendations }: RecommendationsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    duration: 30,
  })

  if (recommendations.length === 0) return null

  // For a single recommendation, no carousel needed
  if (recommendations.length === 1 && recommendations[0]) {
    return (
      <div className="max-w-xl">
        <RecommendationCard recommendation={recommendations[0]} />
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.33%-16px)]">
              <RecommendationCard recommendation={rec} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}
