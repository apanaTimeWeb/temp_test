// RESPONSIBILITY: Define canonical route/configuration constants for billing member refunds; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_refunds/config/billing_member_refunds.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_refunds workflow. The legacy query-view URL remains supported. */
const omitApiRouteProperties = <T extends object, K extends keyof T>(source: T, keys: readonly K[]): Omit<T, K> => {
  const result: Partial<T> = { ...source };
  for (const key of keys) delete result[key];
  return result as Omit<T, K>;
};

const SUPERADMIN_FINANCE_MEMBER_REFUNDS_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_refunds',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_refunds',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_refunds",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_refunds",
  SCREENS: {
    "member_refunds": "/superadmin/superadmin_billing/billing_overview?view=member_refunds",
  },
} as const;

/** Existing public route/API contract copied verbatim from its former shared config owner. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS = {
  DASHBOARD: '/superadmin/superadmin_dashboard',
  PAGE: '/superadmin/superadmin_billing',
  // Existing public page routes.
  AUTO_SUSPEND_PAGE: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_auto_suspend_policy',
  FINANCE_DASHBOARD_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_finance_overview',
  INVOICE_PAGE: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices',
  INVOICE_DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_invoices?view=member_invoices_detail&id=${encodeURIComponent(id)}`,
  RECEIPT_PAGE: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts',
  RECEIPT_DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_invoices?view=member_receipts_detail&id=${encodeURIComponent(id)}`,
  COLLECT_FEE_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_payments_collection',
  LATE_FEES_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
  PAYMENT_PROMISES_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
  PAYMENTS_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_payments',
  REFERRALS_PAGE: '/superadmin/superadmin_users/users_overview?view=member_referrals',
  RENEWALS_PAGE: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals',
  SECURITY_DEPOSITS_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_security_deposits',
  SUBSCRIPTIONS_PAGE: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions',
  TRUST_SCORE_PAGE: '/superadmin/superadmin_users/users_overview?view=member_trust_score',
  REFUNDS_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_refunds',

  // API endpoints — preserve the existing backend contract.
  REFUNDS_LIST: '/finance/refunds',
} as const;

const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS = SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS;



const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS_ROUTES_ONLY = omitApiRouteProperties(SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS, ['REFUNDS_LIST'] as const);

const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS_ROUTES_ONLY = omitApiRouteProperties(SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS, ['REFUNDS_LIST'] as const);
/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_REFUNDS_ROUTES = {
  SUPERADMIN_FINANCE_MEMBER_REFUNDS_URLS: SUPERADMIN_FINANCE_MEMBER_REFUNDS_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS_ROUTES_ONLY,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS_ROUTES_ONLY
} as const;

/** Verified API endpoint constants are kept separate from navigation routes. */
export const SUPERADMIN_BILLING_MEMBER_REFUNDS_API = {
  REFUNDS_LIST: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS.REFUNDS_LIST
} as const;
