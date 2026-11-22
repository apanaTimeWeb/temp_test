// types/SuperadminAnalyticsUsageReportsTypes.ts
// Domain and DTO contracts for Superadmin Usage Reports

export type ExportFormatType = 'excel' | 'pdf' | 'csv' | 'print' | 'download';

export interface SuperadminAnalyticsUsageReportsFilters {
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

export interface UsageConsumptionBreakdown {
  label: string;
  used: number;
  limit: number;
  unit: string;
  percentage: number;
}

export interface UsageReportsKpiData {
  totalMembers: number;
  totalStaff: number;
  activeBranches: number;
  storageUsedGb: number;
  storageQuotaGb: number;
  apiCallsCount: number;
  smsConsumed: number;
  whatsappConsumed: number;
  consumptionBreakdown: UsageConsumptionBreakdown[];
}

export interface UsageTrendPoint {
  period: string;
  apiCalls: number;
  storageGb: number;
  messagingCount: number;
}

export interface UsageReportTableRecord {
  id: string;
  libraryCode: string;
  libraryName: string;
  branchName: string;
  plan: string;
  status: 'ACTIVE' | 'PROVISIONING' | 'SUSPENDED' | 'DORMANT';
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  adminName: string;
  adminEmail: string;
  membersCount: number;
  staffCount: number;
  storageMb: number;
  apiCalls: number;
  smsCount: number;
  whatsappCount: number;
  lastActiveDate: string;
}

export interface UsageReportsOverviewData {
  kpis: UsageReportsKpiData;
  usageTrends: UsageTrendPoint[];
  items: UsageReportTableRecord[];
  totalCount: number;
  page: number;
  limit: number;
  filterOptions: {
    libraries: Array<{ id: string; name: string }>;
    branches: Array<{ id: string; name: string }>;
    plans: string[];
    statuses: string[];
    paymentStatuses: string[];
    admins: Array<{ id: string; name: string }>;
  };
}
