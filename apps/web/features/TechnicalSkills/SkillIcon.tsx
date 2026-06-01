'use client'

import {
  SiDotnet,
  SiReact,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiBootstrap,
  SiJquery,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiGit,
  SiGithub,
  SiGithubcopilot,
  SiGithubactions,
  SiTerraform,
  SiJira,
  SiSonar,
  SiDatadog,
  SiPostman,
  SiSwagger,
  SiBitbucket,
  SiVitest,
  SiClaude,
} from 'react-icons/si'
import {
  Database,
  ArrowLeftRight,
  Network,
  Layers,
  Share2,
  LayoutTemplate,
  ShieldCheck,
  Cloud,
  Zap,
  Globe,
  Braces,
  Code2,
  FileCode2,
  Brain,
  MonitorSmartphone,
  Bot,
} from 'lucide-react'
import type { IconType } from 'react-icons'
import type { LucideIcon } from 'lucide-react'

type AnyIcon = IconType | LucideIcon

interface IconEntry {
  icon?: AnyIcon
  src?: string        // path in /public — takes priority over icon
  blend?: boolean     // mix-blend-mode: multiply (for PNGs with white bg)
  color: string
  bg: string
  isLucide?: boolean
}

const SKILL_ICON_MAP: Record<string, IconEntry> = {
  /* ── Backend ── */
  '.net 10':                       { icon: SiDotnet,        color: '#fff', bg: '#512BD4' },
  '.net':                          { icon: SiDotnet,        color: '#fff', bg: '#512BD4' },
  'c#':                            { src: '/icons/csharp.png', color: '#fff', bg: '#5C2D91' },
  'asp.net core':                  { icon: SiDotnet,        color: '#fff', bg: '#512BD4' },
  'entity framework':              { icon: Database,        color: '#fff', bg: '#512BD4', isLucide: true },
  'rest api':                      { icon: ArrowLeftRight,  color: '#fff', bg: '#1D4ED8', isLucide: true },
  'rest apis':                     { icon: ArrowLeftRight,  color: '#fff', bg: '#1D4ED8', isLucide: true },
  'microservices':                 { icon: Network,         color: '#fff', bg: '#6366F1', isLucide: true },
  'sql server':                    { icon: Database,        color: '#fff', bg: '#CC2927', isLucide: true },

  /* ── Frontend ── */
  'react':                         { icon: SiReact,         color: '#61DAFB', bg: '#20232A' },
  'angular':                       { icon: SiAngular,       color: '#fff', bg: '#DD0031' },
  'typescript':                    { icon: SiTypescript,    color: '#fff', bg: '#3178C6' },
  'javascript':                    { icon: SiJavascript,    color: '#000', bg: '#F7DF1E' },
  'html5':                         { icon: SiHtml5,         color: '#fff', bg: '#E34F26' },
  'css3':                          { icon: SiCss,           color: '#fff', bg: '#1572B6' },
  'bootstrap':                     { icon: SiBootstrap,     color: '#fff', bg: '#7952B3' },
  'jquery':                        { icon: SiJquery,        color: '#fff', bg: '#0769AD' },
  'json':                          { icon: Braces,          color: '#fff', bg: '#64748B', isLucide: true },
  'xml':                           { icon: FileCode2,       color: '#fff', bg: '#64748B', isLucide: true },

  /* ── Databases (legacy) ── */
  'postgresql':                    { icon: SiPostgresql,    color: '#fff', bg: '#4169E1' },
  'mongodb':                       { icon: SiMongodb,       color: '#fff', bg: '#47A248' },
  'redis':                         { icon: SiRedis,         color: '#fff', bg: '#DC382D' },

  /* ── Cloud & DevOps ── */
  'aws lambda':                    { icon: Zap,             color: '#fff', bg: '#FF9900', isLucide: true },
  'api gateway':                   { icon: Globe,           color: '#fff', bg: '#FF9900', isLucide: true },
  'azure devops':                  { src: '/icons/azure-devops.png', blend: true, color: '#fff', bg: '#0078D4' },
  'terraform':                     { icon: SiTerraform,     color: '#fff', bg: '#7B42BC' },
  'ci/cd pipelines':               { icon: SiGithubactions, color: '#fff', bg: '#2088FF' },
  'git':                           { icon: SiGit,           color: '#fff', bg: '#F05032' },
  'bitbucket':                     { icon: SiBitbucket,     color: '#fff', bg: '#0052CC' },
  'docker':                        { icon: SiDocker,        color: '#fff', bg: '#2496ED' },
  'azure':                         { icon: Cloud,           color: '#fff', bg: '#0078D4', isLucide: true },
  'github':                        { icon: SiGithub,        color: '#fff', bg: '#181717' },

  /* ── Architecture & Quality ── */
  'clean architecture':            { icon: Layers,          color: '#fff', bg: '#7C3AED', isLucide: true },
  'service oriented architecture': { icon: Share2,          color: '#fff', bg: '#5B21B6', isLucide: true },
  'design patterns':               { icon: LayoutTemplate,  color: '#fff', bg: '#6D28D9', isLucide: true },
  'solid principles':              { icon: ShieldCheck,     color: '#fff', bg: '#059669', isLucide: true },
  'unit testing':                  { icon: SiVitest,        color: '#fff', bg: '#6E9F18' },
  'agile/scrum':                   { src: '/icons/agile.png', blend: true, color: '#fff', bg: '#e0f2fe' },

  /* ── Tools ── */
  'jira':                          { icon: SiJira,          color: '#fff', bg: '#0052CC' },
  'sonarqube':                     { icon: SiSonar,         color: '#fff', bg: '#CB3032' },
  'datadog':                       { icon: SiDatadog,       color: '#fff', bg: '#632CA6' },
  'postman':                       { icon: SiPostman,       color: '#fff', bg: '#FF6C37' },
  'swagger':                       { icon: SiSwagger,       color: '#fff', bg: '#173647' },
  'visual studio':                 { src: '/icons/visual-studio.png', color: '#fff', bg: '#5C2D91' },
  'vs code':                       { src: '/icons/vscode.png',        color: '#fff', bg: '#007ACC' },

  /* ── AI & Productivity ── */
  'github copilot':                { icon: SiGithubcopilot, color: '#fff', bg: '#000000' },
  'claude code':                   { icon: SiClaude,        color: '#fff', bg: '#D97706' },
  'prompt engineering':            { icon: Bot,             color: '#fff', bg: '#8B5CF6', isLucide: true },
  'llm research & brainstorming':  { icon: Brain,           color: '#fff', bg: '#7C3AED', isLucide: true },
}

const FALLBACK_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
]

function hashColor(name: string): string {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return FALLBACK_COLORS[Math.abs(h) % FALLBACK_COLORS.length] ?? '#6366f1'
}

function getInitials(name: string): string {
  return name.split(/[\s.\-/]+/).map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()
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
        <div className="skill-icon-badge" style={{ backgroundColor: entry.bg }}>
          {entry.src ? (
            <img
              src={entry.src}
              alt={name}
              width={size}
              height={size}
              style={{ objectFit: 'contain', mixBlendMode: entry.blend ? 'multiply' : 'normal' }}
            />
          ) : entry.isLucide ? (
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
