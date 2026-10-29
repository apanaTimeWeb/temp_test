import { format, isValid, parseISO } from 'date-fns';
import { enGB, hi } from 'date-fns/locale';

/**
 * Formats a validated ISO calendar-date string as a local calendar date.
 * `parseISO` keeps date-only values in local time; formatting must not shift them through UTC.
 */
export function formatManagerHelpSupportCalendarDate(value: string, locale: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = parseISO(value);
  if (!isValid(date) || format(date, 'yyyy-MM-dd') !== value) return value;
  return format(date, 'dd MMM yyyy', { locale: locale === 'hi' ? hi : enGB });
}
