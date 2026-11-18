// RESPONSIBILITY: Define canonical route/configuration constants for billing invoices.
const SUPERADMIN_BILLING_INVOICES_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_invoices',
  SCREEN: '/superadmin/superadmin_billing/billing_invoices',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

export const SUPERADMIN_BILLING_INVOICES_ROUTES = {
  SUPERADMIN_BILLING_INVOICES_URLS: SUPERADMIN_BILLING_INVOICES_URLS,
} as const;

export const SUPERADMIN_BILLING_INVOICES_API = {} as const;

export const SUPERADMIN_NAVIGATION_ROUTES = {
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
} as const;
