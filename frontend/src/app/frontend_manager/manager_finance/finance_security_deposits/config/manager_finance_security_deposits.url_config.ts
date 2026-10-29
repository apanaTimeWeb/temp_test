/** Canonical route configuration owned by manager finance security deposits. */
const ROOT = '/frontend_manager/manager_finance/finance_security_deposits' as const;

export const MANAGER_FINANCE_SECURITY_DEPOSITS_ROUTES = {
  root: ROOT,
  SECURITY_DEPOSITS: `${ROOT}?${new URLSearchParams({ view: 'security_deposits' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_SECURITY_DEPOSITS_API = {} as const;
