export interface SkillCategory {
  id: string
  title: string
  skills: string[]
}

export interface SkillsData {
  categories: SkillCategory[]
}
