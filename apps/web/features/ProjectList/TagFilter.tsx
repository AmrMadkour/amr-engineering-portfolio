'use client'

import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: string[]
  activeTag: string | null
  onChange: (tag: string | null) => void
  filterAllLabel: string
}

export function TagFilter({ tags, activeTag, onChange, filterAllLabel }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
          activeTag === null
            ? 'border-foreground bg-foreground text-background'
            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
        )}
      >
        {filterAllLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag === activeTag ? null : tag)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            tag === activeTag
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
