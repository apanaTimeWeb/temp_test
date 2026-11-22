// RESPONSIBILITY: Define compile-time types for security user sessions; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityUserSessionsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
