import { apiFetch } from './api'
import type { Profile } from '@/types/profile'

export function getProfile(locale: string): Promise<Profile> {
  return apiFetch<Profile>('/v1/profile', locale)
}
