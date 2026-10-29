/** Canonical route configuration owned by manager finance collect fee. */
const ROOT = '/frontend_manager/manager_finance/finance_collect_fee' as const;

export const MANAGER_FINANCE_COLLECT_FEE_ROUTES = {
  root: ROOT,
  COLLECT_FEE: `${ROOT}?${new URLSearchParams({ view: 'collect_fee' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_COLLECT_FEE_API = {} as const;
