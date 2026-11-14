// RESPONSIBILITY: Define canonical route/configuration constants for billing member security deposits; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_security_deposits/config/billing_member_security_deposits.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_security_deposits workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_FINANCE_MEMBER_SECURITY_DEPOSITS_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_security_deposits',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_security_deposits',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_security_deposits",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_security_deposits",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_SECURITY_DEPOSITS_ROUTES = {
  SUPERADMIN_FINANCE_MEMBER_SECURITY_DEPOSITS_URLS: SUPERADMIN_FINANCE_MEMBER_SECURITY_DEPOSITS_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_SECURITY_DEPOSITS_API = {} as const;
