// RESPONSIBILITY: Define stable module-owned constants for billing member payments collection; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionStaticConstants.ts -> typed constants -> component/hook/config behavior.
/** Leaf-local static config retained from the prior shared constants file; no UI/business behavior changes. */
export const SUPERADMIN_FINANCE_COLLECT_FEE_PAGE_CLIENT_RECEIPT_COUNTER = 124;
