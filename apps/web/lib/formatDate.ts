export function formatYearMonth(yearMonth: string, locale = 'en'): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const intlLocale = locale === 'ar' ? 'ar-EG' : locale === 'nl' ? 'nl-NL' : 'en-US'
  return new Intl.DateTimeFormat(intlLocale, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1))
}
