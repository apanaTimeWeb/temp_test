/** Canonical route configuration owned by manager finance auto suspend. */
const ROOT = '/frontend_manager/manager_finance/finance_auto_suspend' as const;

export const MANAGER_FINANCE_AUTO_SUSPEND_ROUTES = {
  root: ROOT,
  AUTO_SUSPEND: `${ROOT}?${new URLSearchParams({ view: 'auto_suspend' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_AUTO_SUSPEND_API = {} as const;
