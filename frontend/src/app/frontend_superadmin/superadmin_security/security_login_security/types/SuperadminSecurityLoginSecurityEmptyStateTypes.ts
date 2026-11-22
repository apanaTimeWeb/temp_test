// RESPONSIBILITY: Define compile-time types for security login security; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_login_security/types/SuperadminSecurityLoginSecurityEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityLoginSecurityEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
