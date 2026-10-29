const ROOT = '/frontend_manager/manager_finance/finance_invoices' as const;

const INVOICE_ROUTE_URLS = {
  ROOT,
  INVOICE: `${ROOT}?${new URLSearchParams({ view: 'invoice' }).toString()}`,
  INVOICE_DETAIL: (id: string) => `${ROOT}?${new URLSearchParams({ view: 'invoice_detail', id }).toString()}`,
} as const;

/** Canonical module-owned routes. */
export const MANAGER_FINANCE_INVOICES_ROUTES = { ...INVOICE_ROUTE_URLS, root: ROOT } as const;

/** No verified HTTP endpoint URLs are supplied for the fail-closed finance API. */
export const MANAGER_FINANCE_INVOICES_API = {} as const;
