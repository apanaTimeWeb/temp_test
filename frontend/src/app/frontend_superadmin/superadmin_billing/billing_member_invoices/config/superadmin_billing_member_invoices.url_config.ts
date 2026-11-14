// RESPONSIBILITY: Define canonical route/configuration constants for billing member invoices; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_invoices/config/superadmin_billing_member_invoices.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the member invoices workflow. Existing legacy query-view routes remain supported. */
const SUPERADMIN_FINANCE_INVOICE_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_invoices',
  SCREEN: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices',
  DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_member_invoices?view=detail&id=${encodeURIComponent(id)}`,
} as const;

/** Leaf-owned invoice navigation contract; API behavior is not inferred. */
const SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_invoices',
  INVOICE_PAGE: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices',
  INVOICE_DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_member_invoices?view=detail&id=${encodeURIComponent(id)}`,
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES = {
  PAGE: '/superadmin/superadmin_billing/billing_member_invoices',
  DETAIL_PAGE: (id: string) => `/superadmin/superadmin_billing/billing_member_invoices?view=detail&id=${encodeURIComponent(id)}`,
  SUPERADMIN_FINANCE_INVOICE_URLS: SUPERADMIN_FINANCE_INVOICE_URLS,
  SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS: SUPERADMIN_BILLING_INVOICES_MEMBER_INVOICES_FINANCE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_INVOICES_API = {} as const;
