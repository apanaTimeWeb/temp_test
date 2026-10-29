/** Canonical route and fail-closed API contract for manager finance payments. */
const ROOT = '/frontend_manager/manager_finance/finance_payments' as const;

export const MANAGER_FINANCE_PAYMENTS_ROUTES = {
  root: ROOT,
  PAYMENTS: `${ROOT}?view=payments`,
} as const;

/** CONTRACT_MISSING: no authoritative external payments endpoint was supplied. */
export const MANAGER_FINANCE_PAYMENTS_API = {} as const;
