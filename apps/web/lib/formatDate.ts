export function formatYearMonth(yearMonth: string, locale = 'en'): string {
  const parts = yearMonth.split('-').map(Number)
  const year = parts[0] ?? 0
  const month = parts[1] ?? 1
  const intlLocale = locale === 'ar' ? 'ar-EG' : locale === 'nl' ? 'nl-NL' : 'en-US'
  return new Intl.DateTimeFormat(intlLocale, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1))
}
