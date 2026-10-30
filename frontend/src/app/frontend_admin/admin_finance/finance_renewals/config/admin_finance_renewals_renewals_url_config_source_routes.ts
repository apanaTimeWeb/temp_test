/** Canonical route contract for renewals. No API URL is declared because no verified renewal endpoint was supplied. */
export const ADMIN_RENEWALS_ROOT = '/admin/admin_finance/finance_renewals' as const;
export const ADMIN_RENEWALS_URLS = { ROOT: ADMIN_RENEWALS_ROOT } as const;
export const MODULE_URLS = ADMIN_RENEWALS_URLS;
