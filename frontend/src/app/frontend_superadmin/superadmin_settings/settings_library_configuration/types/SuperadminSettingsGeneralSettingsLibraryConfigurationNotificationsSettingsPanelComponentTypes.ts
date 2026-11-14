// RESPONSIBILITY: Define compile-time types for settings library configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanelComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_views/superadmin_settings_library_configuration_page/SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanel.tsx. */
export interface SuperadminSystemNotificationsSettingsPanelProps {
  saved: boolean;
  onSavePreview: () => void;
}
