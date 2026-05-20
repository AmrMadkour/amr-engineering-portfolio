'use client'

import {
  SiDotnet,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiVercel,
  SiGithubactions,
  SiOpentelemetry,
} from 'react-icons/si'
import {
  Layers,
  Network,
  Database,
  Zap,
  ArrowLeftRight,
  TestTube2,
  ScrollText,
  Code2,
  MonitorSmartphone,
  LayoutTemplate,
  Cloud,
} from 'lucide-react'
import type { IconType } from 'react-icons'
import type { LucideIcon } from 'lucide-react'

type AnyIcon = IconType | LucideIcon

interface IconEntry {
  icon: AnyIcon
  color: string
  bg: string
  isLucide?: boolean
}

const SKILL_ICON_MAP: Record<string, IconEntry> = {
  '.net 10':                 { icon: SiDotnet,          color: '#fff', bg: '#512BD4' },
  '.net 9':                  { icon: SiDotnet,          color: '#fff', bg: '#512BD4' },
  '.net':                    { icon: SiDotnet,          color: '#fff', bg: '#512BD4' },
  'c#':                      { icon: Code2,             color: '#fff', bg: '#239120', isLucide: true },
  'asp.net core':            { icon: SiDotnet,          color: '#fff', bg: '#512BD4' },
  'clean architecture':      { icon: Layers,            color: '#fff', bg: '#7C3AED', isLucide: true },
  'domain-driven design':    { icon: Network,           color: '#fff', bg: '#5B21B6', isLucide: true },
  'entity framework core':   { icon: Database,          color: '#fff', bg: '#512BD4', isLucide: true },
  'signalr':                 { icon: Zap,               color: '#fff', bg: '#0D9488', isLucide: true },
  'grpc':                    { icon: ArrowLeftRight,    color: '#fff', bg: '#1D4ED8', isLucide: true },
  'next.js':                 { icon: SiNextdotjs,       color: '#fff', bg: '#000000' },
  'nextjs':                  { icon: SiNextdotjs,       color: '#fff', bg: '#000000' },
  'react':                   { icon: SiReact,           color: '#61DAFB', bg: '#20232A' },
  'typescript':              { icon: SiTypescript,      color: '#fff', bg: '#3178C6' },
  'javascript':              { icon: SiJavascript,      color: '#000', bg: '#F7DF1E' },
  'tailwind css':            { icon: SiTailwindcss,     color: '#fff', bg: '#0EA5E9' },
  'tailwindcss':             { icon: SiTailwindcss,     color: '#fff', bg: '#0EA5E9' },
  'html5':                   { icon: SiHtml5,           color: '#fff', bg: '#E34F26' },
  'html':                    { icon: SiHtml5,           color: '#fff', bg: '#E34F26' },
  'css':                     { icon: SiCss,             color: '#fff', bg: '#1572B6' },
  'css3':                    { icon: SiCss,             color: '#fff', bg: '#1572B6' },
  'sql server':              { icon: Database,          color: '#fff', bg: '#CC2927', isLucide: true },
  'postgresql':              { icon: SiPostgresql,      color: '#fff', bg: '#4169E1' },
  'redis':                   { icon: SiRedis,           color: '#fff', bg: '#DC382D' },
  'mongodb':                 { icon: SiMongodb,         color: '#fff', bg: '#47A248' },
  'docker':                  { icon: SiDocker,          color: '#fff', bg: '#2496ED' },
  'kubernetes':              { icon: SiKubernetes,      color: '#fff', bg: '#326CE5' },
  'azure':                   { icon: Cloud,              color: '#fff', bg: '#0078D4', isLucide: true },
  'github actions':          { icon: SiGithubactions,   color: '#fff', bg: '#2088FF' },
  'git':                     { icon: SiGit,             color: '#fff', bg: '#F05032' },
  'github':                  { icon: SiGithub,          color: '#fff', bg: '#181717' },
  'vercel':                  { icon: SiVercel,          color: '#fff', bg: '#000000' },
  'xunit':                   { icon: TestTube2,         color: '#fff', bg: '#6D28D9', isLucide: true },
  'serilog':                 { icon: ScrollText,        color: '#fff', bg: '#0F766E', isLucide: true },
  'opentelemetry':           { icon: SiOpentelemetry,   color: '#fff', bg: '#F5A800' },
  'spectre.console':         { icon: MonitorSmartphone, color: '#fff', bg: '#1E293B', isLucide: true },
  'node.js':                 { icon: LayoutTemplate,    color: '#fff', bg: '#339933', isLucide: true },
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
  return name.split(/[\s.\-/]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

interface SkillIconProps {
  name: string
  size?: number
}

export function SkillIcon({ name, size = 22 }: SkillIconProps) {
  const entry = SKILL_ICON_MAP[name.toLowerCase()]

  return (
    <div className="skill-icon-wrap">
      {entry ? (
        <div
          className="skill-icon-badge"
          style={{ backgroundColor: entry.bg }}
        >
          {entry.isLucide ? (
            (() => {
              const Icon = entry.icon as LucideIcon
              return <Icon size={size} color={entry.color} strokeWidth={1.75} />
            })()
          ) : (
            (() => {
              const Icon = entry.icon as IconType
              return <Icon size={size} color={entry.color} />
            })()
          )}
        </div>
      ) : (
        <div
          className="skill-icon-badge skill-icon-fallback"
          style={{ backgroundColor: hashColor(name) }}
        >
          <span className="skill-icon-initials">{getInitials(name)}</span>
        </div>
      )}
      <span className="skill-tooltip">{name}</span>
    </div>
  )
}
