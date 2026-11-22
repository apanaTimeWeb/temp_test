// types/SuperadminAnalyticsPlatformReportsTypes.ts
// Domain and DTO contracts for Superadmin Platform Reports

export type PlatformAccountStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'CHURNED';
export type PlatformPaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'OVERDUE';

export interface SuperadminAnalyticsPlatformReportsFilters {
  dateRange: string;
  libraryId: string;
  branchId: string;
  plan: string;
  status: string;
  adminId: string;
  paymentStatus: string;
  searchQuery: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PlatformReportsKpiData {
  totalLibraries: number;
  totalBranches: number;
  activeAccounts: number;
  activeAccountsRate: number;
  growthRate: number;
  accountCreations: number;
  accountCancellations: number;
  churnRate: number;
}

export interface PlatformGrowthTimelinePoint {
  period: string;
  newLibraries: number;
  newBranches: number;
  activeTotal: number;
}

export interface PlatformStatusDistributionPoint {
  status: PlatformAccountStatus;
  count: number;
  percentage: number;
}

export interface PlatformReportTableRecord {
  id: string;
  libraryName: string;
  libraryCode: string;
  branchCount: number;
  city: string;
  state: string;
  adminName: string;
  adminEmail: string;
  plan: string;
  status: PlatformAccountStatus;
  paymentStatus: PlatformPaymentStatus;
  createdDate: string;
  lastActiveDate: string;
}

export interface PlatformReportsOverviewData {
  kpis: PlatformReportsKpiData;
  growthTimeline: PlatformGrowthTimelinePoint[];
  statusDistribution: PlatformStatusDistributionPoint[];
  items: PlatformReportTableRecord[];
  totalCount: number;
  filterOptions: {
    libraries: Array<{ id: string; name: string }>;
    branches: Array<{ id: string; name: string }>;
    plans: string[];
    statuses: PlatformAccountStatus[];
    paymentStatuses: PlatformPaymentStatus[];
    admins: Array<{ id: string; name: string }>;
  };
}

export type ExportFormatType = 'excel' | 'pdf' | 'csv' | 'print' | 'download';
