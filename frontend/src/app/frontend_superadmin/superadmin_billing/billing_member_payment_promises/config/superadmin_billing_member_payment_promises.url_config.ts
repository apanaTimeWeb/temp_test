// RESPONSIBILITY: Define canonical route/configuration constants for billing member payment promises; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_payment_promises/config/superadmin_billing_member_payment_promises.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_payment_promises workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_FINANCE_MEMBER_PAYMENT_PROMISES_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_payment_promises',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_ROUTES = {
  SUPERADMIN_FINANCE_MEMBER_PAYMENT_PROMISES_URLS: SUPERADMIN_FINANCE_MEMBER_PAYMENT_PROMISES_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_PAYMENT_PROMISES_API = {} as const;
