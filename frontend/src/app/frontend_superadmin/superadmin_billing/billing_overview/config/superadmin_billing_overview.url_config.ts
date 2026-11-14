// RESPONSIBILITY: Define canonical route/configuration constants for billing overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_overview/config/superadmin_billing_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_BILLING_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview",
  SCREEN: "/superadmin/superadmin_billing/billing_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_security_deposits",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_security_deposits",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_finance_overview",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_finance_overview",
} as const;

/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Existing API endpoint paths and public page routes observed in the supplied frontend source. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_URLS = {
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
} as const;

const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_MODULE_URLS = SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_URLS;
/**
 * Defines the public BillingOverviewMemberPaymentsModuleUrls contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type BillingOverviewMemberPaymentsModuleUrls = typeof SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_MODULE_URLS;

/** Grouped public route contract for member_payments; screens share this isolated feature module. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_PAYMENTS_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_payments",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_payments",
  SCREENS: {
    "member_payments": "/superadmin/superadmin_billing/billing_overview?view=member_payments",
  },
} as const;

/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Existing API endpoint paths and public page routes observed in the supplied frontend source. */
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
} as const;

const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS = SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS;
/**
 * Defines the public BillingOverviewMemberRefundsModuleUrls contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type BillingOverviewMemberRefundsModuleUrls = typeof SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS;

/** Grouped public route contract for member_refunds; screens share this isolated feature module. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_refunds",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_refunds",
  SCREENS: {
    "member_refunds": "/superadmin/superadmin_billing/billing_overview?view=member_refunds",
  },
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_LATE_FEES_FINANCE_LATE_FEES_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_late_fees",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_late_fees",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_payment_promises",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_payment_promises",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_overview?view=member_payments_collection",
  SCREEN: "/superadmin/superadmin_billing/billing_overview?view=member_payments_collection",
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS = {
  MEMBER_FINANCE_OVERVIEW: '/superadmin/superadmin_billing/billing_overview?view=member_finance_overview',
  MEMBER_LATE_FEES: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
  MEMBER_PAYMENT_PROMISES: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
  MEMBER_PAYMENTS: '/superadmin/superadmin_billing/billing_overview?view=member_payments',
  MEMBER_PAYMENTS_COLLECTION: '/superadmin/superadmin_billing/billing_overview?view=member_payments_collection',
  MEMBER_REFUNDS: '/superadmin/superadmin_billing/billing_overview?view=member_refunds',
  MEMBER_SECURITY_DEPOSITS: '/superadmin/superadmin_billing/billing_overview?view=member_security_deposits',
} as const;






/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_OVERVIEW_ROUTES = {
  SUPERADMIN_BILLING_OVERVIEW_URLS: SUPERADMIN_BILLING_OVERVIEW_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_SECURITY_DEPOSITS_FINANCE_SECURITY_DEPOSITS_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_FINANCE_FINANCE_DASHBOARD_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_MODULE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_MODULE_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_PAYMENTS_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_PAYMENTS_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_MODULE_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_LATE_FEES_FINANCE_LATE_FEES_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_LATE_FEES_FINANCE_LATE_FEES_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENT_PROMISES_FINANCE_PAYMENT_PROMISES_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS,
  SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS
} as const;

/** No payment/refund API is consumed by this overview page; endpoints remain owned by their autonomous leaf modules. */
export const SUPERADMIN_BILLING_OVERVIEW_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
} as const;
