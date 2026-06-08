'use client'

import { useEffect } from 'react'

export function ScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto'
    }
  }, [])
  return null
}
