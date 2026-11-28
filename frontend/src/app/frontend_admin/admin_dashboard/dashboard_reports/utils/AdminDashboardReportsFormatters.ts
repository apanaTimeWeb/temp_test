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
  let resolvedCurrency = currency;
  let resolvedLocale = locale;
  if ((currency === 'en' || currency === 'hi') && (locale.length === 3 || locale === 'JPY' || locale === 'INR' || locale === 'USD')) {
    resolvedCurrency = locale;
    resolvedLocale = currency;
  }
  resolvedLocale = resolvedLocale === 'hi' ? 'hi-IN' : resolvedLocale === 'en' ? 'en-IN' : resolvedLocale;
  const fractionDigits = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: resolvedCurrency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency', currency: resolvedCurrency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits,
  }).format(adminDashboardReportsAnalyticsMinorToMajor(minorUnits, resolvedCurrency, resolvedLocale));
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
  const rows = [['id', 'category', 'data_status', 'exportable'], ...reports.map((report) => [report.id, report.category, report.dataStatus, String(report.exportable)])];
  return rows.map((row) => row.map(escapeAdminDashboardReportsAnalyticsCsvCell).join(',')).join('\r\n');
}

export interface AdminReportsChartPalette {
  isDark: boolean;
  primary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  secondary: string;
  textSecondary: string;
  textOnPrimary: string;
  gridBorder: string;
  surfaceBg: string;
}

function readRootCssToken(tokenName: string, fallback: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
  return value || fallback;
}

/** Resolves semantic CSS custom properties for ApexCharts so charts adapt smoothly to dark and light themes. */
export function resolveAdminReportsChartPalette(resolvedTheme?: string): AdminReportsChartPalette {
  const isDark =
    resolvedTheme === 'dark' ||
    (resolvedTheme !== 'light' &&
      (typeof document === 'undefined' || document.documentElement.classList.contains('dark')));

  return {
    isDark,
    primary: readRootCssToken('--chart-primary', isDark ? 'rgb(99, 102, 241)' : 'rgb(234, 179, 8)'),
    success: readRootCssToken('--chart-success', isDark ? 'rgb(52, 211, 153)' : 'rgb(22, 163, 74)'),
    danger: readRootCssToken('--chart-danger', isDark ? 'rgb(248, 113, 113)' : 'rgb(220, 38, 38)'),
    warning: readRootCssToken('--chart-warning', isDark ? 'rgb(251, 191, 36)' : 'rgb(245, 158, 11)'),
    info: readRootCssToken('--chart-info', isDark ? 'rgb(34, 211, 238)' : 'rgb(37, 99, 235)'),
    secondary: readRootCssToken('--chart-secondary', isDark ? 'rgb(192, 132, 252)' : 'rgb(124, 58, 237)'),
    textSecondary: readRootCssToken('--text-secondary', isDark ? 'rgb(148, 163, 184)' : 'rgb(82, 82, 91)'),
    textOnPrimary: readRootCssToken('--text-on-primary', 'rgb(255, 255, 255)'),
    gridBorder: readRootCssToken('--chart-grid', isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0, 0, 0, 0.08)'),
    surfaceBg: readRootCssToken('--bg-page', isDark ? 'rgb(3, 7, 18)' : 'rgb(255, 255, 255)'),
  };
}
