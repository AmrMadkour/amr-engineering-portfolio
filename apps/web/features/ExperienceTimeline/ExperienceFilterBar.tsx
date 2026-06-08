'use client'

import { cn } from '@/lib/utils'

export type ExperienceFilter = {
  type: 'all' | 'company' | 'personal' | 'freelance'
  domain: string | null
  era: string | null
}

interface Props {
  filter: ExperienceFilter
  onChange: (f: ExperienceFilter) => void
  availableDomains: string[]
  availableEras: string[]
  resultCount: number
  totalCount: number
}

const DEFAULT_FILTER: ExperienceFilter = { type: 'all', domain: null, era: null }

const TYPE_OPTIONS: { value: ExperienceFilter['type']; label: string }[] = [
  { value: 'all',       label: 'All'      },
  { value: 'company',   label: 'Company'  },
  { value: 'personal',  label: 'Personal' },
  { value: 'freelance', label: 'Freelance'},
]

const DOMAIN_LABELS: Record<string, string> = {
  backend:  'Backend',
  fullstack: 'Full-Stack',
  cloud:    'Cloud',
  frontend: 'Frontend',
}

const ERA_LABELS: Record<string, string> = {
  early:  'Early Career',
  mid:    'Mid Career',
  recent: 'Recent',
}

const pillBase = 'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer select-none whitespace-nowrap'
const pillOff  = 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
const pillOn   = 'border-primary bg-primary text-white'

function isFiltered(filter: ExperienceFilter) {
  return filter.type !== 'all' || filter.domain !== null || filter.era !== null
}

export function ExperienceFilterBar({ filter, onChange, availableDomains, availableEras, resultCount, totalCount }: Props) {
  const filtered = isFiltered(filter)

  return (
    <div className="mb-6 space-y-3">

      {/* Status row */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {filtered
            ? `Showing ${resultCount} of ${totalCount}`
            : `${totalCount} entries`}
        </p>
        {filtered && (
          <button
            className={cn(pillBase, 'border-dashed border-border/60 bg-transparent text-muted-foreground hover:border-destructive/40 hover:text-destructive')}
            onClick={() => onChange(DEFAULT_FILTER)}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Type</span>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
          {TYPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={cn(pillBase, filter.type === value ? pillOn : pillOff)}
              onClick={() => onChange({ ...filter, type: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain / Focus filter */}
      {availableDomains.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Focus</span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
            <button
              className={cn(pillBase, filter.domain === null ? pillOn : pillOff)}
              onClick={() => onChange({ ...filter, domain: null })}
            >
              All
            </button>
            {availableDomains.map((d) => (
              <button
                key={d}
                className={cn(pillBase, filter.domain === d ? pillOn : pillOff)}
                onClick={() => onChange({ ...filter, domain: filter.domain === d ? null : d })}
              >
                {DOMAIN_LABELS[d] ?? d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Era filter */}
      {availableEras.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Era</span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
            <button
              className={cn(pillBase, filter.era === null ? pillOn : pillOff)}
              onClick={() => onChange({ ...filter, era: null })}
            >
              All
            </button>
            {availableEras.map((era) => (
              <button
                key={era}
                className={cn(pillBase, filter.era === era ? pillOn : pillOff)}
                onClick={() => onChange({ ...filter, era: filter.era === era ? null : era })}
              >
                {ERA_LABELS[era] ?? era}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
