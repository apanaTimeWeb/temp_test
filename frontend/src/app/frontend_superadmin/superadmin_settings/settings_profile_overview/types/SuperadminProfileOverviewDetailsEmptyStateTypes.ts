// RESPONSIBILITY: Define compile-time types for settings profile overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewDetailsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminProfileOverviewDetailsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
