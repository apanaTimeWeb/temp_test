// RESPONSIBILITY: Define compile-time types for system backup history; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBackupHistoryRestoreFlowEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
