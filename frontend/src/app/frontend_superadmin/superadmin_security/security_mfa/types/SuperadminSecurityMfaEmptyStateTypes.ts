// RESPONSIBILITY: Define compile-time types for security mfa; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_mfa/types/SuperadminSecurityMfaEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityMfaEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
