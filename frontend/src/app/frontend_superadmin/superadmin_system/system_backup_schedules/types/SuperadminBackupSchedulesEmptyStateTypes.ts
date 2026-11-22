// RESPONSIBILITY: Define compile-time types for system backup schedules; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_schedules/types/SuperadminBackupSchedulesEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBackupSchedulesEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
