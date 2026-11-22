const ROOT = '/frontend_manager/manager_finance/finance_fines_payments' as const;

/** Canonical route contract for the Fines & Payments leaf. */
export const MANAGER_FINANCE_FINES_PAYMENTS_ROUTES = {
  ROOT,
  FINES_AND_PAYMENTS: `${ROOT}?${new URLSearchParams({ view: 'fines_and_payments' }).toString()}`,
  root: ROOT,
  REFUNDS: '/frontend_manager/manager_finance/finance_security_deposits',
} as const;

export const MANAGER_FINANCE_FINES_PAYMENTS_API = {
  LIST: '/api/v1/manager/finance/fines-payments' as const,
  WAIVE: (id: string) => `/api/v1/manager/finance/fines-payments/${encodeURIComponent(id)}/waive` as const,
  COLLECT: (id: string) => `/api/v1/manager/finance/fines-payments/${encodeURIComponent(id)}/collect` as const,
  EXPORT_CSV: '/api/v1/manager/finance/fines-payments/export-csv' as const,
} as const;
