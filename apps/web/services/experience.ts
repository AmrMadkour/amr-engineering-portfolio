import { apiFetch } from './api'
import type { Experience } from '@/types/experience'

export function getExperience(locale: string): Promise<Experience[]> {
  return apiFetch<Experience[]>('/v1/experience', locale)
}
