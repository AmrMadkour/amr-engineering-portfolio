import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: 'section' | 'div' | 'article'
}

export function Section({ className, children, as: Tag = 'section', ...props }: SectionProps) {
  return (
    <Tag
      className={cn('py-16 sm:py-24', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
