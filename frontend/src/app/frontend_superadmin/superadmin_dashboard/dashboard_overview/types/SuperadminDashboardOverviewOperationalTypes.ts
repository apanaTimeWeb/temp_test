// FLOW: Feature source -> superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewOperationalTypes.ts -> shared operational types.
/** Responsibility: Superadmin Dashboard Operational Types; defines type contracts for telemetry, alerts, requests, and audit. */

export interface SuperadminDashboardPendingBranchRequest {
  id: string;
  libraryName: string;
  libraryId: string;
  branchName: string;
  city: string;
  seats: number;
  requestedAt: string;
  status: 'pending' | 'reviewing';
}

export interface SuperadminDashboardPendingUpgradeRequest {
  id: string;
  libraryName: string;
  libraryId: string;
  currentPlan: string;
  requestedPlan: string;
  priceDelta: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SuperadminDashboardPlatformAlert {
  id: string;
  type: 'payment_failure' | 'subscription_expiring' | 'failed_login' | 'job_failure';
  severity: 'critical' | 'high' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  entityName?: string;
  amount?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface SuperadminDashboardAdminLoginRecord {
  id: string;
  adminName: string;
  email: string;
  libraryName: string;
  ipAddress: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'mfa_verified' | 'failed';
}

export interface SuperadminDashboardAuditRecord {
  id: string;
  actor: string;
  action: string;
  target: string;
  module: string;
  timestamp: string;
  ipAddress: string;
}

export interface SuperadminDashboardRecentBranch {
  id: string;
  branchName: string;
  libraryName: string;
  city: string;
  seats: number;
  manager: string;
  status: 'active' | 'setup' | 'maintenance';
  createdAt: string;
}

export interface SuperadminDashboardSupportTicketItem {
  id: string;
  ticketNumber: string;
  libraryName: string;
  subject: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'escalated';
  slaMinutesRemaining: number;
  createdAt: string;
}

export interface SuperadminDashboardInfrastructureHealthExtended {
  uptime: string;
  activeUsers: number;
  apiLatency: string;
  lastBackup: string;
  serverStatus: 'healthy' | 'degraded' | 'down';
  apiErrorRate: string;
  databaseStatus: 'healthy' | 'degraded' | 'down';
  dbConnections: string;
  dbReadLatency: string;
  dbWriteLatency: string;
  backupSize: string;
  backupStatus: 'success' | 'running' | 'failed';
  failedJobsCount: number;
}

export interface SuperadminDashboardFilterState {
  timeRange: 'today' | '7d' | '30d' | 'this_month' | 'custom';
  account: string;
  branch: string;
  plan: string;
  status: string;
}
