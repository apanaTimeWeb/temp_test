// RESPONSIBILITY: Define compile-time types for system backup configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationKpiCardComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminBackupConfigurationKpiCard.tsx. */
export interface SuperadminSystemKpiCardProps {
  title: string; value: string | number; subtitle?: string; icon?: string;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string; className?: string;
}
