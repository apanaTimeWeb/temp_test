// constants/SuperadminAnalyticsUsageReportsConstants.ts
// Constants, lookup tables, and default values for Superadmin Usage Reports

export const USAGE_REPORTS_DATE_RANGES = [
  { value: 'TODAY', label: 'Today' },
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'ALL_TIME', label: 'All Time' },
] as const;

export const DEFAULT_USAGE_REPORTS_FILTERS = {
  dateRange: 'THIS_MONTH',
  libraryId: 'ALL',
  branchId: 'ALL',
  plan: 'ALL',
  status: 'ALL',
  adminId: 'ALL',
  paymentStatus: 'ALL',
  searchQuery: '',
  page: 1,
  limit: 10,
  sortBy: 'membersCount',
  sortOrder: 'desc' as const,
};

export const USAGE_PLAN_OPTIONS = [
  'ALL',
  'Starter Library',
  'Pro Growth',
  'Multi-Branch Enterprise',
  'Custom Academic',
] as const;

export const USAGE_STATUS_OPTIONS = [
  'ALL',
  'ACTIVE',
  'PROVISIONING',
  'SUSPENDED',
  'DORMANT',
] as const;

export const USAGE_PAYMENT_STATUS_OPTIONS = [
  'ALL',
  'PAID',
  'PENDING',
  'OVERDUE',
] as const;
