// RESPONSIBILITY: Define stable module-owned constants for billing member invoices; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_invoices/constants/SuperadminBillingInvoicesMemberInvoicesConstants.ts -> typed constants -> component/hook/config behavior.


/** Stable module-owned options/configuration; user-visible labels must be resolved through locale keys in the consumer. */
export const SUPERADMIN_FINANCE_INVOICE_STATUS_BADGE = {
  paid: 'fin-badge fin-badge--success', pending: 'fin-badge fin-badge--warning', overdue: 'fin-badge fin-badge--danger',
};
