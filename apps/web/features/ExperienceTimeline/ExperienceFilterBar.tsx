'use client'

import { cn } from '@/lib/utils'

export type ExperienceFilter = {
  type: 'all' | 'company' | 'personal' | 'freelance'
  tech: string | null
  year: string | null
}

interface Props {
  filter: ExperienceFilter
  onChange: (f: ExperienceFilter) => void
  availableTechs: string[]
  availableYears: string[]
  resultCount: number
  totalCount: number
}

const DEFAULT_FILTER: ExperienceFilter = { type: 'all', tech: null, year: null }

const TYPE_OPTIONS: { value: ExperienceFilter['type']; label: string }[] = [
  { value: 'all',       label: 'All'      },
  { value: 'company',   label: 'Company'  },
  { value: 'personal',  label: 'Personal' },
  { value: 'freelance', label: 'Freelance'},
]

const pillBase = 'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer select-none whitespace-nowrap'
const pillOff  = 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
const pillOn   = 'border-primary bg-primary/10 text-primary'

function isFiltered(filter: ExperienceFilter) {
  return filter.type !== 'all' || filter.tech !== null || filter.year !== null
}

export function ExperienceFilterBar({ filter, onChange, availableTechs, availableYears, resultCount, totalCount }: Props) {
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

      {/* Tech filter */}
      {availableTechs.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Stack</span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
            <button
              className={cn(pillBase, filter.tech === null ? pillOn : pillOff)}
              onClick={() => onChange({ ...filter, tech: null })}
            >
              All
            </button>
            {availableTechs.map((tech) => (
              <button
                key={tech}
                className={cn(pillBase, filter.tech === tech ? pillOn : pillOff)}
                onClick={() => onChange({ ...filter, tech: filter.tech === tech ? null : tech })}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year filter */}
      {availableYears.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Year</span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
            <button
              className={cn(pillBase, filter.year === null ? pillOn : pillOff)}
              onClick={() => onChange({ ...filter, year: null })}
            >
              All
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                className={cn(pillBase, filter.year === year ? pillOn : pillOff)}
                onClick={() => onChange({ ...filter, year: filter.year === year ? null : year })}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
