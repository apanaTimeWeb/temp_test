/** Canonical route and fail-closed API contract for manager finance refunds. */
const ROOT = '/frontend_manager/manager_finance/finance_refunds' as const;

export const MANAGER_FINANCE_REFUNDS_ROUTES = {
  root: ROOT,
  REFUNDS: `${ROOT}?view=refunds`,
} as const;

/** CONTRACT_MISSING: no authoritative external refunds endpoint was supplied. */
export const MANAGER_FINANCE_REFUNDS_API = {} as const;
