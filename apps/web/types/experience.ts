export interface Experience {
  id: string
  slug: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
  highlights: string[]
  technologies: string[]
}
