// RESPONSIBILITY: Define canonical route/configuration constants for plans promotions; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_plans/plans_promotions/config/superadmin_plans_promotions.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Promo Codes & Offers autonomous workflow; no API contract is inferred. */
const SUPERADMIN_BILLING_PROMO_CODES_URLS = {
  PAGE: '/superadmin/superadmin_plans/plans_promotions',
  SCREEN: '/superadmin/superadmin_plans/plans_promotions',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_PLANS_PROMOTIONS_ROUTES = {
  SUPERADMIN_BILLING_PROMO_CODES_URLS: SUPERADMIN_BILLING_PROMO_CODES_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_PLANS_PROMOTIONS_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
} as const;
