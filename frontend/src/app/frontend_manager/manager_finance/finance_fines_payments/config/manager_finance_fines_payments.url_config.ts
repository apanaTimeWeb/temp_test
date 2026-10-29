const ROOT = '/frontend_manager/manager_finance/finance_fines_payments' as const;

/** Canonical route contract for the Fines & Payments leaf. */
export const MANAGER_FINANCE_FINES_PAYMENTS_ROUTES = {
  ROOT,
  FINES_AND_PAYMENTS: `${ROOT}?${new URLSearchParams({ view: 'fines_and_payments' }).toString()}`,
  root: ROOT,
  REFUNDS: '/frontend_manager/manager_finance/finance_refunds',
} as const;

/** No verified HTTP endpoint URLs are supplied for the fail-closed finance API. */
export const MANAGER_FINANCE_FINES_PAYMENTS_API = {} as const;
