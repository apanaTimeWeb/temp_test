const ROOT = '/frontend_manager/manager_finance/finance_receipts' as const;

const RECEIPT_ROUTE_URLS = {
  ROOT,
  RECEIPT: `${ROOT}?${new URLSearchParams({ view: 'receipt' }).toString()}`,
  RECEIPT_DETAIL: (id: string) => `${ROOT}?${new URLSearchParams({ view: 'receipt_detail', id }).toString()}`,
} as const;

/** Canonical module-owned routes. */
export const MANAGER_FINANCE_RECEIPTS_ROUTES = { ...RECEIPT_ROUTE_URLS, root: ROOT } as const;

/** No verified HTTP endpoint URLs are supplied for the fail-closed finance API. */
export const MANAGER_FINANCE_RECEIPTS_API = {} as const;
