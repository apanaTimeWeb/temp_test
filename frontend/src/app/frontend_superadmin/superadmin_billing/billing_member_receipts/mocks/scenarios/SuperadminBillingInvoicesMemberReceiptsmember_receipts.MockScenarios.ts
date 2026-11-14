// RESPONSIBILITY: Define scenario metadata for billing member receipts; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_billing/billing_member_receipts/mocks/scenarios/SuperadminBillingInvoicesMemberReceiptsmember_receipts.MockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** UI-only test scenarios; these names do not imply backend endpoints. */
export const SUPERADMIN_FINANCE_RECEIPT_SCENARIOS = [
  'loading',
  'empty',
  'error',
  'unavailable_mutation',
] as const;
