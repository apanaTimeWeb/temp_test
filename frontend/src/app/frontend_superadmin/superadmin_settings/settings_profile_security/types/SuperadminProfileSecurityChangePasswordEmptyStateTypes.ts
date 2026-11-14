// RESPONSIBILITY: Define compile-time types for settings profile security; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminProfileSecurityChangePasswordEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
