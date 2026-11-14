// RESPONSIBILITY: Define compile-time types for billing member security deposits; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_security_deposits/types/SuperadminBillingOverviewMemberSecurityDepositsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminBillingOverviewMemberSecurityDepositsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
