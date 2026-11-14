// RESPONSIBILITY: Define canonical route/configuration constants for billing member receipts; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_receipts/config/superadmin_billing_member_receipts.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned member receipts route contract; legacy query-view aliases remain supported by billing_invoices. */
const SUPERADMIN_FINANCE_MEMBER_RECEIPTS_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_receipts',
  SCREEN: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts',
  DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_member_receipts?view=detail&id=${encodeURIComponent(id)}`,
} as const;

/** Compatibility contract for existing member-receipts imports; unrelated invoice workflow constants stay parent-owned. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS = {
  PAGE: '/superadmin/superadmin_billing',
  SCREEN: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts',
  RECEIPT_PAGE: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts',
  RECEIPT_DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_member_receipts?view=detail&id=${encodeURIComponent(id)}`,
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES = {
  PAGE: '/superadmin/superadmin_billing/billing_member_receipts',
  DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_member_receipts?view=detail&id=${encodeURIComponent(id)}`,
  SUPERADMIN_FINANCE_MEMBER_RECEIPTS_URLS: SUPERADMIN_FINANCE_MEMBER_RECEIPTS_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_RECEIPTS_FINANCE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_RECEIPTS_API = {} as const;
