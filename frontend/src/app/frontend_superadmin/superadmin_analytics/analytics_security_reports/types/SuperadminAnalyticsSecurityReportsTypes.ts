// types/SuperadminAnalyticsSecurityReportsTypes.ts
// Domain and DTO contracts for Superadmin Security Reports

export type ExportFormatType = 'excel' | 'pdf' | 'csv' | 'print' | 'download';

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'ACCOUNT_LOCKED'
  | 'PERMISSION_CHANGED'
  | 'DATA_EXPORTED'
  | 'SUSPICIOUS_ACTIVITY';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SuperadminAnalyticsSecurityReportsFilters {
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

export interface SecurityThreatDistributionItem {
  category: string;
  count: number;
  percentage: number;
}

export interface SecurityReportsKpiData {
  totalLogins: number;
  failedLogins: number;
  lockedAccounts: number;
  permissionChanges: number;
  dataExports: number;
  suspiciousActivities: number;
  threatDistribution: SecurityThreatDistributionItem[];
}

export interface SecurityAuditTrendPoint {
  period: string;
  successfulLogins: number;
  failedLogins: number;
  threatEvents: number;
}

export interface SecurityReportTableRecord {
  id: string;
  timestamp: string;
  libraryCode: string;
  libraryName: string;
  branchName: string;
  plan: string;
  status: string;
  paymentStatus: string;
  adminName: string;
  adminEmail: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  ipAddress: string;
  location: string;
  details: string;
}

export interface SecurityReportsOverviewData {
  kpis: SecurityReportsKpiData;
  auditTrends: SecurityAuditTrendPoint[];
  items: SecurityReportTableRecord[];
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
