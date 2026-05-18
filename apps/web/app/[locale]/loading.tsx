import { Container } from '@/components/layout/Container'

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-1/4 rounded bg-muted" />
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </Container>
  )
}
