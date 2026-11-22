/** Canonical route configuration owned by manager finance payment promises. */
const ROOT = '/frontend_manager/manager_finance/finance_payment_promises' as const;

export const MANAGER_FINANCE_PAYMENT_PROMISES_ROUTES = {
  root: ROOT,
  PAYMENT_PROMISES: `${ROOT}?${new URLSearchParams({ view: 'payment_promises' }).toString()}`,
} as const;

export const MANAGER_FINANCE_PAYMENT_PROMISES_API = {
  LIST: '/api/v1/manager/finance/payment-promises' as const,
  CREATE: '/api/v1/manager/finance/payment-promises' as const,
  UPDATE: (id: string) => `/api/v1/manager/finance/payment-promises/${encodeURIComponent(id)}` as const,
  MARK_PAID: (id: string) => `/api/v1/manager/finance/payment-promises/${encodeURIComponent(id)}/mark-paid` as const,
  EXPORT_CSV: '/api/v1/manager/finance/payment-promises/export-csv' as const,
} as const;
