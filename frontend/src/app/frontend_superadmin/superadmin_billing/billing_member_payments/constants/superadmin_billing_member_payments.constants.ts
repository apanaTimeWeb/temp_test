// RESPONSIBILITY: Define stable module-owned constants for billing member payments; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_payments/constants/superadmin_billing_member_payments.constants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminBillingOverviewMemberPaymentsPageClient.tsx. */
export const SUPERADMIN_FINANCE_PAYMENTS_PAGE_CLIENT_MODE_BADGE = {
  cash: 'fin-badge fin-badge--cash',
  upi:  'fin-badge fin-badge--upi',
  card: 'fin-badge fin-badge--card',
  bank: 'fin-badge fin-badge--bank',
};
