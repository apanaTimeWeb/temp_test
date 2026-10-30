import type { ADMIN_AUDIT_LOGS_SEVERITY_VALUES } from '@/app/frontend_admin/admin_system/system_audit_logs/config/admin_system_audit_logs.url_config';
import type { AdminSystemAuditLogsScenario } from '@/app/frontend_admin/admin_system/system_audit_logs/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminAuditLogsKnownSeverity = typeof ADMIN_AUDIT_LOGS_SEVERITY_VALUES[number];
export type AdminAuditLogsSeverity = AdminAuditLogsKnownSeverity | 'unknown';
export type AdminAuditLogsFilter = 'all' | AdminAuditLogsSeverity;
export interface AdminAuditLogsRecord { id: string; action: string; module: string; performedBy: string; role: string; details: string; severity: AdminAuditLogsSeverity; timestamp: string; ip: string; }

export interface AdminAuditLogsFiltersProps {
  filter: AdminAuditLogsFilter;
  onFilterChange: (filter: AdminAuditLogsFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export interface AdminAuditLogsRecordsPanelProps {
  records: AdminAuditLogsRecord[];
  isLoading: boolean;
  errorMessage: string | null;
  hasActiveFilter: boolean;
  onRetry: () => void;
  onRowClicked: (record: AdminAuditLogsRecord) => void;
}

export interface AdminSystemAuditLogsHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemAuditLogsScenario;
}
