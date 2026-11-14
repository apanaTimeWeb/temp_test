// RESPONSIBILITY: Format feature-owned complaint date-only values for localized display.
// FLOW: Complaint date string + active locale -> stable localized date label; malformed values stay empty.
export function formatSuperadminSupportComplaintDate(value: string | null | undefined, locale: string): string {
  if (!value) return '';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  let date: Date;
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  } else {
    date = new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
  }
  try {
    const resolvedLocale = locale.toLowerCase().startsWith('hi') ? 'hi-IN' : 'en-IN';
    return new Intl.DateTimeFormat(resolvedLocale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
  } catch {
    return '';
  }
}
