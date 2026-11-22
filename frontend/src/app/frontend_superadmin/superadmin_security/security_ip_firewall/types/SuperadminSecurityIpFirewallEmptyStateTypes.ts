// RESPONSIBILITY: Define compile-time types for security ip firewall; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_ip_firewall/types/SuperadminSecurityIpFirewallEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSecurityIpFirewallEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
