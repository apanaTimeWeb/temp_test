// RESPONSIBILITY: Define stable module-owned constants for billing member refunds; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_refunds/constants/SuperadminBillingOverviewMemberRefundsStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminBillingOverviewMemberRefundsPageClient.tsx. */
export const SUPERADMIN_FINANCE_REFUNDS_PAGE_CLIENT_STATUS_BADGE = {
  pending:   'fin-badge fin-badge--warning',
  approved:  'fin-badge fin-badge--success',
  rejected:  'fin-badge fin-badge--danger',
  processed: 'fin-badge fin-badge--info',
};
