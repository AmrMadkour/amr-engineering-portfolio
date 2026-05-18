'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">
        The page failed to load. This is usually a temporary issue.
      </p>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </Container>
  )
}
