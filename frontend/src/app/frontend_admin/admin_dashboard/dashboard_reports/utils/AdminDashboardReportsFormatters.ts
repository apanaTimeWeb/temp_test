import type {
  AdminDashboardReportsAnalyticsBranchSummary,
  AdminDashboardReportsAnalyticsKpi,
  AdminDashboardReportsReport,
} from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';

function escapeAdminDashboardReportsAnalyticsCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const isFiniteNumber = typeof value === 'number' && Number.isFinite(value);
  const safeText = !isFiniteNumber && /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

/** Converts integer minor units to major units; invalid data is never silently normalized to zero. */
export function adminDashboardReportsAnalyticsMinorToMajor(minorUnits: number, currency = 'INR', locale = 'en-IN'): number {
  if (!Number.isSafeInteger(minorUnits)) {
    throw new RangeError('Report currency amount must be a safe integer in minor units.');
  }
  const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return minorUnits / (10 ** fractionDigits);
}

export function adminDashboardReportsAnalyticsFormatCurrency(minorUnits: number, currency: string, locale: string): string {
  const resolvedLocale = locale === 'hi' ? 'hi-IN' : locale === 'en' ? 'en-IN' : locale;
  const fractionDigits = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits,
  }).format(adminDashboardReportsAnalyticsMinorToMajor(minorUnits, currency, resolvedLocale));
}

/** Formats finite numeric counts with the active application locale. */
export function adminDashboardReportsAnalyticsFormatNumber(value: number, locale: string): string {
  if (!Number.isFinite(value)) return '—';
  const resolvedLocale = locale === 'hi' ? 'hi-IN' : locale === 'en' ? 'en-IN' : locale;
  return new Intl.NumberFormat(resolvedLocale, { maximumFractionDigits: 2 }).format(value);
}

/** Exports the visible demo KPI snapshot and filtered branch summary, never live backend data. */
export function buildAdminDashboardReportsAnalyticsCsv(
  kpis: readonly AdminDashboardReportsAnalyticsKpi[],
  branches: readonly AdminDashboardReportsAnalyticsBranchSummary[],
  currencyCode: string,
): string {
  const rows: unknown[][] = [['Section', 'Branch', 'Metric', 'Value', 'Unit']];
  for (const kpi of kpis) {
    rows.push(['KPI Snapshot', '', kpi.label, kpi.valueKind === 'currency' ? (kpi.amountMinor === null ? '' : adminDashboardReportsAnalyticsMinorToMajor(kpi.amountMinor, currencyCode, 'en-IN')) : (kpi.count ?? ''), kpi.valueKind === 'currency' ? currencyCode : 'count']);
  }
  for (const branch of branches) {
    rows.push(['Branch Snapshot', branch.branch, 'Revenue', adminDashboardReportsAnalyticsMinorToMajor(branch.revenueMinor, currencyCode, 'en-IN'), currencyCode]);
    rows.push(['Branch Snapshot', branch.branch, 'Expenses', adminDashboardReportsAnalyticsMinorToMajor(branch.expenseMinor, currencyCode, 'en-IN'), currencyCode]);
    rows.push(['Branch Snapshot', branch.branch, 'Net Profit', adminDashboardReportsAnalyticsMinorToMajor(branch.revenueMinor - branch.expenseMinor, currencyCode, 'en-IN'), currencyCode]);
    rows.push(['Branch Snapshot', branch.branch, 'Students', branch.students, 'count']);
    rows.push(['Branch Snapshot', branch.branch, 'Occupancy', branch.occupancy, 'percent']);
  }
  return rows.map((row) => row.map(escapeAdminDashboardReportsAnalyticsCsvCell).join(',')).join('\r\n');
}

/** Exports report-library metadata only; no report metrics or unsupported backend data are included. */
export function serializeReportsLibraryCatalogCsv(reports: readonly AdminDashboardReportsReport[]): string {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = [['id', 'category', 'data_status', 'exportable'], ...reports.map((report) => [report.id, report.category, report.dataStatus, String(report.exportable)])];
  return rows.map((row) => row.map(escape).join(',')).join('\r\n');
}
