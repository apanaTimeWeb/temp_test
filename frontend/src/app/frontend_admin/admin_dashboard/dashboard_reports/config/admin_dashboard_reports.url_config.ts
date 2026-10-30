/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import type { AdminDashboardReportsAnalyticsDataset, AdminDashboardReportsAnalyticsRange } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';

/** Canonical browser route and source-observed API contract for dashboard reports. */
export const ADMIN_DASHBOARD_REPORTS_ROUTES = {
  ROOT: '/admin/admin_dashboard/dashboard_reports',
} as const;

/** The route is observed in the supplied API adapter; its response DTO remains contract-incomplete. */
export const ADMIN_DASHBOARD_REPORTS_API = {
  LIST: '/api/v1/admin/reports',
} as const;

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_OPTIONS: ReadonlyArray<{ key: AdminDashboardReportsAnalyticsRange }> = [
  { key: 'thisMonth' },
  { key: 'last3Months' },
  { key: 'thisYear' },
];

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_EMPTY_DATA: AdminDashboardReportsAnalyticsDataset = {
  currencyCode: 'INR',
  kpis: [],
  incomeVsExpense: { thisMonth: [], last3Months: [], thisYear: [] },
  shiftOccupancy: [],
  revenueTrend: { thisMonth: [], last3Months: [], thisYear: [] },
  studentGrowth: { thisMonth: [], last3Months: [], thisYear: [] },
  branchSummary: [],
};

/** Presentation-only translation keys for known report range presets and synthetic KPI labels. */
export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS: Record<AdminDashboardReportsAnalyticsRange, 'RANGE_THIS_MONTH' | 'RANGE_LAST_THREE_MONTHS' | 'RANGE_THIS_YEAR'> = {
  thisMonth: 'RANGE_THIS_MONTH',
  last3Months: 'RANGE_LAST_THREE_MONTHS',
  thisYear: 'RANGE_THIS_YEAR',
};

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS = {
  'Total Revenue This Month': 'KPI_TOTAL_REVENUE_THIS_MONTH',
  'Total Expenses': 'KPI_TOTAL_EXPENSES',
  'Net Profit': 'KPI_NET_PROFIT',
  'Active Students': 'KPI_ACTIVE_STUDENTS',
} as const;

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS = {
  'Gross fees collected': 'KPI_SUB_GROSS_FEES',
  'Rent + Utilities + Staff': 'KPI_SUB_RENT_UTILITIES_STAFF',
  'Revenue minus expenses': 'KPI_SUB_REVENUE_MINUS_EXPENSES',
  'Currently enrolled': 'KPI_SUB_CURRENTLY_ENROLLED',
} as const;

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS = {
  '12% vs last month': 'KPI_TREND_REVENUE',
  '4% vs last month': 'KPI_TREND_EXPENSES',
  '18% vs last month': 'KPI_TREND_PROFIT',
  '8% vs last month': 'KPI_TREND_STUDENTS',
} as const;

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS = {
  Morning: 'SHIFT_MORNING',
  Evening: 'SHIFT_EVENING',
  Night: 'SHIFT_NIGHT',
  'Full Day': 'SHIFT_FULL_DAY',
} as const;

export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS = {
  Jan: 'MONTH_JAN', Feb: 'MONTH_FEB', Mar: 'MONTH_MAR', Apr: 'MONTH_APR',
  May: 'MONTH_MAY', Jun: 'MONTH_JUN', Jul: 'MONTH_JUL', Aug: 'MONTH_AUG',
  Sep: 'MONTH_SEP', Oct: 'MONTH_OCT', Nov: 'MONTH_NOV', Dec: 'MONTH_DEC',
} as const;
