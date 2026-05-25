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
}

const TYPE_OPTIONS: { value: ExperienceFilter['type']; label: string }[] = [
  { value: 'all',       label: 'All'      },
  { value: 'company',   label: 'Company'  },
  { value: 'personal',  label: 'Personal' },
  { value: 'freelance', label: 'Freelance'},
]

const pillBase = 'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer select-none'
const pillOff  = 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
const pillOn   = 'border-primary bg-primary/10 text-primary'

export function ExperienceFilterBar({ filter, onChange, availableTechs, availableYears }: Props) {
  return (
    <div className="flex flex-wrap gap-y-3 gap-x-4 pb-6">

      {/* Type filter */}
      <div className="flex flex-wrap gap-1.5">
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

      {/* Tech filter */}
      {availableTechs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            className={cn(pillBase, filter.tech === null ? pillOn : pillOff)}
            onClick={() => onChange({ ...filter, tech: null })}
          >
            All tech
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
      )}

      {/* Year filter */}
      {availableYears.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            className={cn(pillBase, filter.year === null ? pillOn : pillOff)}
            onClick={() => onChange({ ...filter, year: null })}
          >
            All years
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
      )}

    </div>
  )
}
