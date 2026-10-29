/** Locale-aware labels for date-only and year-month values; never parse them as UTC instants. */
export function formatManagerReportsCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatManagerReportsMonth(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]); const month = Number(match[2]);
  if (month < 1 || month > 12) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short' }).format(new Date(year, month - 1, 1));
}

export function formatManagerReportsDateLabel(value: string, locale: string): string {
  return /^\d{4}-\d{2}$/.test(value) ? formatManagerReportsMonth(value, locale) : formatManagerReportsCalendarDate(value, locale);
}
