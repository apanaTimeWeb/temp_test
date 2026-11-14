// RESPONSIBILITY: Define stable module-owned constants for billing member receipts; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_receipts/constants/SuperadminBillingInvoicesMemberReceiptsConstants.ts -> typed constants -> component/hook/config behavior.


/** Stable module-owned options/configuration; user-visible labels must be resolved through locale keys in the consumer. */
export const SUPERADMIN_FINANCE_RECEIPT_MODE_BADGE = {
  upi: 'fin-badge fin-badge--upi', cash: 'fin-badge fin-badge--cash',
  card: 'fin-badge fin-badge--card', 'bank transfer': 'fin-badge fin-badge--bank',
};
