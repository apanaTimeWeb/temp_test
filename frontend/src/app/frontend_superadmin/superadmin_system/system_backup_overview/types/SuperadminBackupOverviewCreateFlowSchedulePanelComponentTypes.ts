// RESPONSIBILITY: Define compile-time types for system backup overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_overview/types/SuperadminBackupOverviewCreateFlowSchedulePanelComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_backup/superadmin_backup_components/superadmin_backup_operation_panels/SuperadminBackupOverviewCreateFlowSchedulePanel.tsx. */
export interface SuperadminBackupSchedulePanelProps {
  onPreviewNotice: (message: string) => void;
}
