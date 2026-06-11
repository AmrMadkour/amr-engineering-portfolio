import { apiFetch } from './api'
import type { Recommendation } from '@/types/recommendation'

export function getRecommendations(locale: string): Promise<Recommendation[]> {
  return apiFetch<Recommendation[]>('/v1/recommendations', locale)
}
