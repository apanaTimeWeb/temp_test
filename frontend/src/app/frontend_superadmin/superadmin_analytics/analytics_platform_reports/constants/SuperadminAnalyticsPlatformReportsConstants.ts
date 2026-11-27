// constants/SuperadminAnalyticsPlatformReportsConstants.ts
// Constant configurations for Superadmin Platform Reports

import type { SuperadminAnalyticsPlatformReportsFilters } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/types/SuperadminAnalyticsPlatformReportsTypes';

export const PLATFORM_REPORTS_DATE_RANGES = [
  { value: 'today', labelKey: 'DATE_RANGE_TODAY' },
  { value: 'last_7_days', labelKey: 'DATE_RANGE_LAST_7_DAYS' },
  { value: 'last_30_days', labelKey: 'DATE_RANGE_LAST_30_DAYS' },
  { value: 'last_90_days', labelKey: 'DATE_RANGE_LAST_90_DAYS' },
  { value: 'this_year', labelKey: 'DATE_RANGE_THIS_YEAR' },
  { value: 'all_time', labelKey: 'DATE_RANGE_ALL_TIME' },
] as const;

export const DEFAULT_PLATFORM_REPORTS_FILTERS: SuperadminAnalyticsPlatformReportsFilters = {
  dateRange: 'last_30_days',
  libraryId: 'ALL',
  branchId: 'ALL',
  plan: 'ALL',
  status: 'ALL',
  adminId: 'ALL',
  paymentStatus: 'ALL',
  searchQuery: '',
  page: 1,
  limit: 10,
  sortBy: 'createdDate',
  sortOrder: 'desc',
};

export const PLATFORM_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
  SUSPENDED: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
  INACTIVE: { bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400' },
  CHURNED: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400' },
};

export const PLATFORM_PAYMENT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PAID: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
  PENDING: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
  FAILED: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400' },
  OVERDUE: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400' },
};
