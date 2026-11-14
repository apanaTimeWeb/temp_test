// RESPONSIBILITY: Define compile-time types for security active sessions; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_active_sessions/types/SuperadminSecurityActiveSessionsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityActiveSessionsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
