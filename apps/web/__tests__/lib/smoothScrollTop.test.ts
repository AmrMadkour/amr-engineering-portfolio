import { describe, it, expect, vi, beforeEach } from 'vitest'
import { smoothScrollTop } from '@/lib/smoothScrollTop'

describe('smoothScrollTop', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollY', 500)
    vi.stubGlobal('scrollTo', vi.fn())
    // Pass a timestamp well past the 700ms duration so t=1 and the loop exits
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(performance.now() + 1000)
      return 0
    })
  })

  it('does nothing when already at the top', () => {
    vi.stubGlobal('scrollY', 0)
    smoothScrollTop()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('calls scrollTo when page is scrolled down', () => {
    smoothScrollTop()
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('scrolls toward 0 (not further down)', () => {
    smoothScrollTop()
    const calls = vi.mocked(window.scrollTo).mock.calls
    const lastY = calls[calls.length - 1]?.[1] as number
    expect(lastY).toBeGreaterThanOrEqual(0)
    expect(lastY).toBeLessThanOrEqual(500)
  })
})
