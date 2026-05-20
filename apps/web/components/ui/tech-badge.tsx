import {
  SiNextdotjs,
  SiDotnet,
  SiTypescript,
  SiTailwindcss,
  SiReact,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiPython,
  SiRust,
  SiGo,
  SiRedis,
  SiMongodb,
  SiGraphql,
  SiKubernetes,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiVuedotjs,
  SiAngular,
  SiVercel,
  SiGithub,
} from 'react-icons/si'
import type { IconType } from 'react-icons'

interface TechEntry {
  icon: IconType
  color: string
  bg: string
}

const TECH_MAP: Record<string, TechEntry> = {
  'next.js': { icon: SiNextdotjs, color: '#ffffff', bg: '#000000' },
  'nextjs': { icon: SiNextdotjs, color: '#ffffff', bg: '#000000' },
  '.net 10': { icon: SiDotnet, color: '#ffffff', bg: '#512BD4' },
  '.net 9': { icon: SiDotnet, color: '#ffffff', bg: '#512BD4' },
  '.net': { icon: SiDotnet, color: '#ffffff', bg: '#512BD4' },
  'typescript': { icon: SiTypescript, color: '#ffffff', bg: '#3178C6' },
  'tailwind css': { icon: SiTailwindcss, color: '#ffffff', bg: '#0ea5c9' },
  'tailwindcss': { icon: SiTailwindcss, color: '#ffffff', bg: '#0ea5c9' },
  'react': { icon: SiReact, color: '#61DAFB', bg: '#20232A' },
  'node.js': { icon: SiNodedotjs, color: '#ffffff', bg: '#339933' },
  'nodejs': { icon: SiNodedotjs, color: '#ffffff', bg: '#339933' },
  'postgresql': { icon: SiPostgresql, color: '#ffffff', bg: '#4169E1' },
  'docker': { icon: SiDocker, color: '#ffffff', bg: '#2496ED' },
  'git': { icon: SiGit, color: '#ffffff', bg: '#F05032' },
  'python': { icon: SiPython, color: '#ffffff', bg: '#3776AB' },
  'rust': { icon: SiRust, color: '#ffffff', bg: '#CE422B' },
  'go': { icon: SiGo, color: '#ffffff', bg: '#00ADD8' },
  'redis': { icon: SiRedis, color: '#ffffff', bg: '#DC382D' },
  'mongodb': { icon: SiMongodb, color: '#ffffff', bg: '#47A248' },
  'graphql': { icon: SiGraphql, color: '#ffffff', bg: '#E10098' },
  'kubernetes': { icon: SiKubernetes, color: '#ffffff', bg: '#326CE5' },
  'javascript': { icon: SiJavascript, color: '#000000', bg: '#F7DF1E' },
  'html': { icon: SiHtml5, color: '#ffffff', bg: '#E34F26' },
  'html5': { icon: SiHtml5, color: '#ffffff', bg: '#E34F26' },
  'css': { icon: SiCss, color: '#ffffff', bg: '#1572B6' },
  'css3': { icon: SiCss, color: '#ffffff', bg: '#1572B6' },
  'vue': { icon: SiVuedotjs, color: '#ffffff', bg: '#4FC08D' },
  'vue.js': { icon: SiVuedotjs, color: '#ffffff', bg: '#4FC08D' },
  'angular': { icon: SiAngular, color: '#ffffff', bg: '#DD0031' },
  'vercel': { icon: SiVercel, color: '#ffffff', bg: '#000000' },
  'github': { icon: SiGithub, color: '#ffffff', bg: '#181717' },
}

const FALLBACK_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
]

function hashColor(name: string): string {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return FALLBACK_COLORS[Math.abs(h) % FALLBACK_COLORS.length]
}

function getInitials(name: string): string {
  return name.split(/[\s.-]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function TechBadge({ name }: { name: string }) {
  const entry = TECH_MAP[name.toLowerCase()]

  if (entry) {
    const Icon = entry.icon
    return (
      <span
        style={{ backgroundColor: entry.bg }}
        className="inline-flex size-9 items-center justify-center rounded-lg flex-shrink-0"
        title={name}
      >
        <Icon size={20} color={entry.color} />
      </span>
    )
  }

  return (
    <span
      style={{ backgroundColor: hashColor(name) }}
      className="inline-flex h-9 min-w-[2.25rem] px-2 items-center justify-center rounded-lg flex-shrink-0 text-white text-[10px] font-bold tracking-wide"
      title={name}
    >
      {getInitials(name)}
    </span>
  )
}
