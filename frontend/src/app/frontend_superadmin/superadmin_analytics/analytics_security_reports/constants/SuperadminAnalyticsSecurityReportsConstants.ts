// constants/SuperadminAnalyticsSecurityReportsConstants.ts
// Constants, lookup tables, and default values for Superadmin Security Reports

export const SECURITY_REPORTS_DATE_RANGES = [
  { value: 'TODAY', label: 'Today' },
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'ALL_TIME', label: 'All Time' },
] as const;

export const DEFAULT_SECURITY_REPORTS_FILTERS = {
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
  sortBy: 'timestamp',
  sortOrder: 'desc' as const,
};

export const SECURITY_EVENT_TYPES = [
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'ACCOUNT_LOCKED',
  'PERMISSION_CHANGED',
  'DATA_EXPORTED',
  'SUSPICIOUS_ACTIVITY',
] as const;

export const SECURITY_PLAN_OPTIONS = [
  'ALL',
  'Starter Library',
  'Pro Growth',
  'Multi-Branch Enterprise',
  'Custom Academic',
] as const;

export const SECURITY_STATUS_OPTIONS = [
  'ALL',
  'ACTIVE',
  'SUSPENDED',
  'LOCKED',
] as const;

export const SECURITY_PAYMENT_STATUS_OPTIONS = [
  'ALL',
  'PAID',
  'PENDING',
  'OVERDUE',
] as const;
