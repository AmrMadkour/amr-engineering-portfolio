export interface Experience {
  id: string
  slug: string
  type: 'company' | 'personal' | 'freelance'
  featured: boolean
  company: string | null
  role: string | null
  startDate: string
  endDate: string | null
  description: string
  highlights: string[]
  technologies: string[]
  domain: string | null
}
