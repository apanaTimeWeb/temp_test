// RESPONSIBILITY: Define canonical route/configuration constants for billing overview.
const SUPERADMIN_BILLING_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview",
  SCREEN: "/superadmin/superadmin_billing/billing_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_billing/billing_overview';

const SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS = {
  member_finance_overview: `${CANONICAL_OWNER_ROUTE}?view=member_finance_overview`,
  member_late_fees: `${CANONICAL_OWNER_ROUTE}?view=member_late_fees`,
  member_payment_promises: `${CANONICAL_OWNER_ROUTE}?view=member_payment_promises`,
  member_payments: `${CANONICAL_OWNER_ROUTE}?view=member_payments`,
  member_payments_collection: `${CANONICAL_OWNER_ROUTE}?view=member_payments_collection`,
  member_refunds: `${CANONICAL_OWNER_ROUTE}?view=member_refunds`,
  member_security_deposits: `${CANONICAL_OWNER_ROUTE}?view=member_security_deposits`,
} as const;

export const SUPERADMIN_BILLING_OVERVIEW_ROUTES = {
  SUPERADMIN_BILLING_OVERVIEW_URLS: SUPERADMIN_BILLING_OVERVIEW_URLS,
  SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS,
} as const;

export const SUPERADMIN_BILLING_OVERVIEW_API = {} as const;

export const SUPERADMIN_NAVIGATION_ROUTES = {
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
} as const;
