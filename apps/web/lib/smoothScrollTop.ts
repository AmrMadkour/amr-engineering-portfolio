export function smoothScrollTop(duration = 700) {
  const start = window.scrollY
  if (start === 0) return
  const startTime = performance.now()

  function tick(now: number) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    // ease-out quart: fast start, gentle landing
    const eased = 1 - Math.pow(1 - t, 4)
    window.scrollTo(0, start * (1 - eased))
    if (t < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
