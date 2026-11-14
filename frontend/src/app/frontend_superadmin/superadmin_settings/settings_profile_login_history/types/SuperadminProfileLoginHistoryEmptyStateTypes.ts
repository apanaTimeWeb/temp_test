// RESPONSIBILITY: Define compile-time types for settings profile login history; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminProfileLoginHistoryEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
