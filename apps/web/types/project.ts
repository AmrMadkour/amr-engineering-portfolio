export interface Project {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  liveUrl: string | null
  repoUrl: string | null
  startDate: string
  endDate: string | null
  featured: boolean
  experienceId: string | null
}
