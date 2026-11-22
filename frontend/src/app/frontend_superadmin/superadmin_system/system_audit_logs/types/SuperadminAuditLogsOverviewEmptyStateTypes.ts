// RESPONSIBILITY: Define compile-time types for system audit logs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminAuditLogsOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
