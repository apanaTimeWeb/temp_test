// RESPONSIBILITY: Define compile-time types for security password policy; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityPasswordPolicyEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
