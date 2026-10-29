/** Feature-local currency formatters; persisted money is integer minor units. */
export function formatManagerExpensesCurrency(amountMinor: number, currencyCode: string, locale: string): string {
  if (!Number.isFinite(amountMinor)) return '—';
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
  const divisor = 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2);
  return formatter.format(amountMinor / divisor);
}

/** Converts explicitly major-unit user input into integer minor units. */
export function toManagerExpensesMinorUnits(amountMajor: number, currencyCode: string, locale: string): number {
  if (!Number.isFinite(amountMajor)) throw new RangeError('Amount must be a finite number.');
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).resolvedOptions().maximumFractionDigits ?? 2;
  return Math.round(amountMajor * (10 ** digits));
}
