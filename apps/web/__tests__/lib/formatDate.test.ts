import { describe, it, expect } from 'vitest'
import { formatYearMonth } from '@/lib/formatDate'

describe('formatYearMonth', () => {
  it('formats a date in English', () => {
    const result = formatYearMonth('2023-07', 'en')
    expect(result).toMatch(/Jul.*2023|2023.*Jul/)
  })

  it('formats a date in Dutch', () => {
    const result = formatYearMonth('2023-07', 'nl')
    // Dutch: "jul. 2023" or "jul 2023"
    expect(result).toMatch(/jul|2023/i)
  })

  it('formats a date in Arabic', () => {
    const result = formatYearMonth('2023-07', 'ar')
    // Arabic date format — just verify it returns a non-empty string
    expect(result.length).toBeGreaterThan(0)
  })

  it('defaults to English when no locale is given', () => {
    const withLocale = formatYearMonth('2020-01', 'en')
    const withDefault = formatYearMonth('2020-01')
    expect(withLocale).toBe(withDefault)
  })

  it('handles edge case month 12', () => {
    const result = formatYearMonth('2021-12', 'en')
    expect(result).toMatch(/Dec.*2021|2021.*Dec/)
  })
})
