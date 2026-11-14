// RESPONSIBILITY: Define stable module-owned constants for billing member security deposits; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_security_deposits/constants/SuperadminBillingOverviewMemberSecurityDepositsStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminBillingOverviewMemberSecurityDepositsPageClient.tsx. */
export const SUPERADMIN_FINANCE_SECURITY_DEPOSITS_PAGE_CLIENT_SELECTOR = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
