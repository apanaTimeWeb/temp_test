/** Canonical route configuration owned by manager finance referrals. */
const ROOT = '/frontend_manager/manager_finance/finance_referrals' as const;

export const MANAGER_FINANCE_REFERRALS_ROUTES = {
  root: ROOT,
  REFERRALS: `${ROOT}?${new URLSearchParams({ view: 'referrals' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_REFERRALS_API = {} as const;
