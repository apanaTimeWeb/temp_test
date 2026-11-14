// RESPONSIBILITY: Define canonical route/configuration constants for accounting financial reports; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_accounting/accounting_financial_reports/config/superadmin_accounting_financial_reports.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_URLS = {
  PAGE: "/superadmin/superadmin_accounting/accounting_financial_reports",
  SCREEN: "/superadmin/superadmin_accounting/accounting_financial_reports",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_ROUTES = {
  SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_URLS: SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_API = {} as const;
