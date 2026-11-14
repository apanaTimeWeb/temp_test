// RESPONSIBILITY: Define compile-time types for security api keys; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_api_keys/types/SuperadminSecurityApiKeysEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityApiKeysEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
