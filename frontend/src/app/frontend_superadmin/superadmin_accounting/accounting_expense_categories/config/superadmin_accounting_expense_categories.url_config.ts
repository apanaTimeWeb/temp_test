// RESPONSIBILITY: Define canonical route/configuration constants for accounting expense categories; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_accounting/accounting_expense_categories/config/superadmin_accounting_expense_categories.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_URLS = {
  PAGE: "/superadmin/superadmin_accounting/accounting_expense_categories",
  SCREEN: "/superadmin/superadmin_accounting/accounting_expense_categories",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_ROUTES = {
  SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_URLS: SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_API = {} as const;
