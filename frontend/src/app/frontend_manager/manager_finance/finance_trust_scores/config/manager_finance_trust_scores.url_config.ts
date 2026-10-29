/** Canonical route configuration owned by manager finance trust scores. */
const ROOT = '/frontend_manager/manager_finance/finance_trust_scores' as const;

export const MANAGER_FINANCE_TRUST_SCORES_ROUTES = {
  root: ROOT,
  TRUST_SCORE: `${ROOT}?${new URLSearchParams({ view: 'trust_score' }).toString()}`,
} as const;

/** CONTRACT_MISSING: no authoritative external endpoint, method, payload, response, auth or tenant contract was supplied. */
export const MANAGER_FINANCE_TRUST_SCORES_API = {} as const;
