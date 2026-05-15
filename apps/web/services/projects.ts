import { apiFetch } from './api'
import type { Project } from '@/types/project'

export function getProjects(locale: string): Promise<Project[]> {
  return apiFetch<Project[]>('/v1/projects', locale)
}
