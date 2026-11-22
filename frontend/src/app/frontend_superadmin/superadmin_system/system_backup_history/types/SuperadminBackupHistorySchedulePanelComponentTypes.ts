// RESPONSIBILITY: Define compile-time types for system backup history; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_history/types/SuperadminBackupHistorySchedulePanelComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_backup/superadmin_backup_components/superadmin_backup_operation_panels/SuperadminBackupHistorySchedulePanel.tsx. */
export interface SuperadminBackupSchedulePanelProps {
  onPreviewNotice: (message: string) => void;
}
