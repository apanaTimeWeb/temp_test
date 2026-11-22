// RESPONSIBILITY: Define compile-time types for system backup configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationSwitchComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminBackupConfigurationSwitch.tsx. */
export interface SuperadminSystemSwitchProps { checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean; id: string; 'aria-label'?: string; 'aria-labelledby'?: string; 'aria-describedby'?: string; title?: string; 'data-testid'?: string; className?: string; }
