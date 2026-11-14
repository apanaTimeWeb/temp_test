// RESPONSIBILITY: Define canonical route/configuration constants for billing member late fees; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_late_fees/config/superadmin_billing_member_late_fees.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_late_fees workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_FINANCE_MEMBER_LATE_FEES_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_late_fees',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_LATE_FEES_FINANCE_LATE_FEES_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_LATE_FEES_ROUTES = {
  SUPERADMIN_FINANCE_MEMBER_LATE_FEES_URLS: SUPERADMIN_FINANCE_MEMBER_LATE_FEES_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_LATE_FEES_FINANCE_LATE_FEES_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_LATE_FEES_FINANCE_LATE_FEES_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_LATE_FEES_API = {} as const;
