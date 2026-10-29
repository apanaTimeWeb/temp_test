/** Canonical route configuration owned by manager finance renewals. */
const ROOT = '/frontend_manager/manager_finance/finance_renewals' as const;

export const MANAGER_FINANCE_RENEWALS_ROUTES = {
  root: ROOT,
  RENEWALS: `${ROOT}?${new URLSearchParams({ view: 'renewals' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_RENEWALS_API = {} as const;
