/** Feature-local currency utilities; money values are integer minor units. */
export function formatManagerSeatsCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  if (!Number.isFinite(amountMinor)) return '—';
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
  const divisor = 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2);
  return formatter.format(amountMinor / divisor);
}

export function toManagerSeatsMinorUnits(amountMajor: number, currencyCode: string, locale: string): number {
  if (!Number.isFinite(amountMajor)) throw new RangeError('Amount must be a finite number.');
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).resolvedOptions().maximumFractionDigits ?? 2;
  return Math.round(amountMajor * (10 ** digits));
}
