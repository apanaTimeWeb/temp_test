/** Canonical route configuration owned by manager finance subscriptions. */
const ROOT = '/frontend_manager/manager_finance/finance_subscriptions' as const;

export const MANAGER_FINANCE_SUBSCRIPTIONS_ROUTES = {
  root: ROOT,
  SUBSCRIPTIONS: `${ROOT}?${new URLSearchParams({ view: 'subscriptions' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_SUBSCRIPTIONS_API = {} as const;
