// RESPONSIBILITY: Define canonical route/configuration constants for billing overview.
const SUPERADMIN_BILLING_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview",
  SCREEN: "/superadmin/superadmin_billing/billing_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

export const SUPERADMIN_BILLING_OVERVIEW_ROUTES = {
  SUPERADMIN_BILLING_OVERVIEW_URLS: SUPERADMIN_BILLING_OVERVIEW_URLS,
} as const;

export const SUPERADMIN_BILLING_OVERVIEW_API = {} as const;

export const SUPERADMIN_NAVIGATION_ROUTES = {
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
} as const;
