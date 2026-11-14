// RESPONSIBILITY: Define stable module-owned constants for billing member payment promises; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_payment_promises/constants/superadmin_billing_member_payment_promises.constants.ts -> typed constants -> component/hook/config behavior.
/** Leaf-local static config retained from the prior shared constants file; no UI/business behavior changes. */
export const SUPERADMIN_FINANCE_PAYMENT_PROMISES_PAGE_CLIENT_STATUS_BADGE = {
  pending: 'fin-badge fin-badge--warning',
  fulfilled: 'fin-badge fin-badge--success',
  overdue: 'fin-badge fin-badge--danger',
};
