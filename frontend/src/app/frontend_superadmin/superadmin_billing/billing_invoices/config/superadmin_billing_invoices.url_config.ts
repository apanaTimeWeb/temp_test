// RESPONSIBILITY: Define canonical route/configuration constants for billing invoices; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_invoices/config/superadmin_billing_invoices.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Invoices & Transactions autonomous workflow; no API contract is inferred. */
const SUPERADMIN_BILLING_INVOICES_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_invoices',
  SCREEN: '/superadmin/superadmin_billing/billing_invoices',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Existing API endpoint paths and public page routes observed in the supplied frontend source. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS = {
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

const SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_MODULE_URLS = SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS;
/**
 * Defines the public BillingInvoicesMemberInvoicesModuleUrls contract for billing invoices. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type BillingInvoicesMemberInvoicesModuleUrls = typeof SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_MODULE_URLS;

/** Leaf-owned route contract for the autonomous member_invoices screen. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_INVOICE_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_invoices?view=member_invoices",
  SCREEN: "/superadmin/superadmin_billing/billing_invoices?view=member_invoices",
} as const;


/** Route retained from a folded child workflow; no backend endpoint is inferred. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_INVOICE_DETAIL_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_invoices?view=member_invoices_detail",
  SCREEN: "/superadmin/superadmin_billing/billing_invoices?view=member_invoices_detail",
} as const;

/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Existing API endpoint paths and public page routes observed in the supplied frontend source. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS = {
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

const SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_MODULE_URLS = SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS;
/**
 * Defines the public BillingInvoicesMemberReceiptsModuleUrls contract for billing invoices. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type BillingInvoicesMemberReceiptsModuleUrls = typeof SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_MODULE_URLS;

/** Leaf-owned route contract for the autonomous member_receipts screen. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_RECEIPT_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_invoices?view=member_receipts",
  SCREEN: "/superadmin/superadmin_billing/billing_invoices?view=member_receipts",
} as const;


/** Route retained from a folded child workflow; no backend endpoint is inferred. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_RECEIPT_DETAIL_URLS = {
  PAGE: "/superadmin/superadmin_billing/billing_invoices?view=member_receipts_detail",
  SCREEN: "/superadmin/superadmin_billing/billing_invoices?view=member_receipts_detail",
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_BILLING_INVOICES_WORKFLOW_URLS = {
  MEMBER_INVOICES: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices',
  MEMBER_INVOICES_DETAIL: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices_detail',
  MEMBER_RECEIPTS: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts',
  MEMBER_RECEIPTS_DETAIL: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts_detail',
} as const;






/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_INVOICES_ROUTES = {
  SUPERADMIN_BILLING_INVOICES_URLS: SUPERADMIN_BILLING_INVOICES_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_MODULE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_MODULE_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_INVOICE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_INVOICE_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_INVOICE_DETAIL_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_INVOICE_DETAIL_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_MODULE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_MODULE_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_RECEIPT_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_RECEIPT_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_RECEIPT_DETAIL_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_RECEIPT_DETAIL_URLS,
  SUPERADMIN_BILLING_INVOICES_WORKFLOW_URLS: SUPERADMIN_BILLING_INVOICES_WORKFLOW_URLS
} as const;

/** No invoice/receipt API endpoint was supplied for this module; finance endpoints remain owned by their leaf modules. */
export const SUPERADMIN_BILLING_INVOICES_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
} as const;
