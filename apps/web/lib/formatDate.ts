export function formatYearMonth(yearMonth: string, locale = 'en'): string {
  const parts = yearMonth.split('-').map(Number)
  const year = parts[0] ?? 0
  const month = parts[1] ?? 1
  const INTL_LOCALE: Record<string, string> = { ar: 'ar-EG', nl: 'nl-NL' }
  const intlLocale = INTL_LOCALE[locale] ?? 'en-US'
  return new Intl.DateTimeFormat(intlLocale, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1))
}
