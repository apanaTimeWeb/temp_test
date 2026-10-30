import type { AdminAssetsRegisterAsset } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';
/** Convert integer minor units to the major currency unit using ISO currency precision. */
export function adminAccountingMinorToMajor(minorUnits: number, currency = 'INR', locale = 'en-IN'): number {
  const safeMinorUnits = Number.isFinite(minorUnits) ? Math.trunc(minorUnits) : 0;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return safeMinorUnits / (10 ** fractionDigits);
}

/** Format a minor-unit amount using the active UI locale; defaults to the app's INR contract. */
export function formatAdminAccountingCurrency(minorUnits: number, locale = 'en-IN', currency = 'INR'): string {
  const resolvedLocale = locale === 'en' ? 'en-IN' : locale === 'hi' ? 'hi-IN' : locale;
  const fractionDigits = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(adminAccountingMinorToMajor(minorUnits, currency, resolvedLocale));
}

/** Convert a user-entered major-unit value to the currency's smallest unit. */
export function toAdminAccountingMinorUnits(majorUnits: number, currency = 'INR', locale = 'en-IN'): number {
  if (!Number.isFinite(majorUnits)) return 0;
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return Math.round(majorUnits * (10 ** fractionDigits));
}

function escapeAdminAssetsRegisterCsvCell(value: unknown): string {
  let text = String(value ?? '');
  if (typeof value === 'string' && /^[\u0000-\u0020]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

/** Serializes the currently visible asset-register rows; amounts are stored in integer minor units. */
export function buildAdminAssetsRegisterCsv(rows: readonly AdminAssetsRegisterAsset[], locale = 'en-IN'): string {
  const data: readonly (readonly unknown[])[] = [
    ['Asset ID', 'Asset Name', 'Category', 'Purchase Date', 'Purchase Value (INR)', 'Current Value (INR)', 'Location', 'Status'],
    ...rows.map((row) => [
      row.id, row.name, row.category, row.purchaseDate,
      formatAdminAccountingCurrency(row.purchaseValue, locale),
      formatAdminAccountingCurrency(row.currentValue, locale),
      row.location, row.status,
    ]),
  ];
  return `\uFEFF${data.map((row) => row.map(escapeAdminAssetsRegisterCsvCell).join(',')).join('\r\n')}`;
}

/** Starts a browser CSV download and always cleans up the temporary anchor and object URL. */
export function downloadAdminAssetsRegisterCsv(filename: string, csv: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') throw new Error('Asset CSV export requires a browser interaction.');
  const objectUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  try {
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
