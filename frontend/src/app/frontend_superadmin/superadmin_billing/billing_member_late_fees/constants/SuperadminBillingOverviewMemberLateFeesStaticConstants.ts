// RESPONSIBILITY: Define stable module-owned constants for billing member late fees; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_billing/billing_member_late_fees/constants/SuperadminBillingOverviewMemberLateFeesStaticConstants.ts -> typed constants -> component/hook/config behavior.
/** Leaf-local static config retained from the prior shared constants file; no UI/business behavior changes. */
export const SUPERADMIN_FINANCE_LATE_FEES_PAGE_CLIENT_INIT_CONFIG = { gracePeriodDays: 5, penaltyPerDay: 50 };
