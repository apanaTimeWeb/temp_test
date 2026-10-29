/** Canonical route configuration owned by manager finance late fees. */
const ROOT = '/frontend_manager/manager_finance/finance_late_fees' as const;

export const MANAGER_FINANCE_LATE_FEES_ROUTES = {
  root: ROOT,
  LATE_FEES: `${ROOT}?${new URLSearchParams({ view: 'late_fees' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_LATE_FEES_API = {} as const;
