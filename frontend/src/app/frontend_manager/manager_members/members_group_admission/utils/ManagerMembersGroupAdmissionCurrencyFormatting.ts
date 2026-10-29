/** Formats a minor-unit integer from an API/fixture using the active locale. */
export function formatManagerGroupAdmissionCurrency(amountMinor: number, currency: string, locale: string): string {
  if (!Number.isFinite(amountMinor)) return '—';
  try {
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    const divisor = 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2);
    return formatter.format(amountMinor / divisor);
  } catch {
    return '—';
  }
}

/** Converts numeric user input in major units to integer minor units. */
export function toManagerGroupAdmissionMinorUnits(amountMajor: number, currency: string, locale: string): number {
  if (!Number.isFinite(amountMajor)) throw new RangeError('Amount must be a finite number.');
  const digits = (new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2);
  return Math.round(amountMajor * (10 ** digits));
}

/** Converts integer minor units to a major-unit number for a controlled form. */
export function fromManagerGroupAdmissionMinorUnits(amountMinor: number, currency: string, locale: string): number {
  if (!Number.isFinite(amountMinor)) throw new RangeError('Amount must be a finite number.');
  const digits = (new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2);
  return amountMinor / (10 ** digits);
}

export function formatManagerGroupAdmissionDate(dateValue: string, locale: string): string {
  if (!dateValue) return '—';
  const parts = dateValue.split('/');
  const iso = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateValue;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  let date: Date;
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return '—';
  } else {
    date = new Date(iso);
  }
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export function formatManagerGroupAdmissionDateTime(dateValue: string | Date, locale: string): string {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
