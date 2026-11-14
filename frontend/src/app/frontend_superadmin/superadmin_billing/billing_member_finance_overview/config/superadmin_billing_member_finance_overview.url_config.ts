// RESPONSIBILITY: Define canonical route/configuration constants for billing member finance overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_finance_overview/config/superadmin_billing_member_finance_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_finance_overview workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_FINANCE_MEMBER_FINANCE_OVERVIEW_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_finance_overview',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_finance_overview',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_finance_overview',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_finance_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_ROUTES = {
  SUPERADMIN_FINANCE_MEMBER_FINANCE_OVERVIEW_URLS: SUPERADMIN_FINANCE_MEMBER_FINANCE_OVERVIEW_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_FINANCE_OVERVIEW_API = {} as const;
