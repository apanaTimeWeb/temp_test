// RESPONSIBILITY: Define compile-time types for system backup overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_overview/types/SuperadminBackupOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBackupOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
