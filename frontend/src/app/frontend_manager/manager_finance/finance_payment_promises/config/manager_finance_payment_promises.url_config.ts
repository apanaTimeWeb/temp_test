/** Canonical route configuration owned by manager finance payment promises. */
const ROOT = '/frontend_manager/manager_finance/finance_payment_promises' as const;

export const MANAGER_FINANCE_PAYMENT_PROMISES_ROUTES = {
  root: ROOT,
  PAYMENT_PROMISES: `${ROOT}?${new URLSearchParams({ view: 'payment_promises' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_PAYMENT_PROMISES_API = {} as const;
