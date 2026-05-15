export interface Recommendation {
  id: string
  authorName: string
  authorTitle: string
  authorCompany: string
  authorAvatarUrl: string | null
  text: string
  date: string
  relationship: string | null
  source: string | null
}
