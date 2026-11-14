// RESPONSIBILITY: Define canonical route/configuration constants for accounting expenses; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_accounting/accounting_expenses/config/superadmin_accounting_expenses.url_config.ts -> typed constants -> owning route or API caller.
/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Public URL aliases. The host Next.js rewrites in INTEGRATION_GUIDE.md map these aliases to the canonical frontend_superadmin route tree. */
const SUPERADMIN_ACCOUNTING_URLS = {
  PAGE: '/superadmin/superadmin_accounting',
  ASSET_MAINTENANCE: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance',
  ASSETS: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry',
  DAILY_SETTLEMENT: '/superadmin/superadmin_accounting/accounting_daily_settlement',
  EXPENSE_CATEGORIES: '/superadmin/superadmin_accounting/accounting_expense_categories',
  EXPENSES_ADD: '/superadmin/superadmin_accounting/accounting_expenses?view=create',
  EXPENSES: '/superadmin/superadmin_accounting/accounting_expenses',
  FINANCIAL_REPORTS: '/superadmin/superadmin_accounting/accounting_financial_reports',
  SEAT_GAP_REPORT: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis',
  SHIFT_GAP_ANALYZER: '/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis',
} as const;

/**
 * No API endpoint strings are declared for this feature because the supplied
 * audit inputs contain no verified API contract for it. Do not invent paths.
 */
const MODULE_URLS = SUPERADMIN_ACCOUNTING_URLS;
/**
 * Defines the public ModuleUrls contract for accounting expenses. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

/** Grouped public route contract for accounting_expenses; screens share this isolated feature module. */
const SUPERADMIN_ACCOUNTING_EXPENSES_URLS = {
  PAGE: "/superadmin/superadmin_accounting/accounting_expenses",
  SCREEN: "/superadmin/superadmin_accounting/accounting_expenses",
  SCREENS: {
    "accounting_expenses": "/superadmin/superadmin_accounting/accounting_expenses",
  },
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Route retained from a folded child workflow; no backend endpoint is inferred. */
const SUPERADMIN_ACCOUNTING_EXPENSES_ADD_URLS = {
  PAGE: "/superadmin/superadmin_accounting/accounting_expenses?view=create",
  SCREEN: "/superadmin/superadmin_accounting/accounting_expenses?view=create",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES = {
  SUPERADMIN_ACCOUNTING_URLS: SUPERADMIN_ACCOUNTING_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_ACCOUNTING_EXPENSES_URLS: SUPERADMIN_ACCOUNTING_EXPENSES_URLS,
  SUPERADMIN_ACCOUNTING_EXPENSES_ADD_URLS: SUPERADMIN_ACCOUNTING_EXPENSES_ADD_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_ACCOUNTING_EXPENSES_API = {} as const;
