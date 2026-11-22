/** Canonical route configuration owned by manager finance trust scores. */
const ROOT = '/frontend_manager/manager_finance/finance_trust_scores' as const;

export const MANAGER_FINANCE_TRUST_SCORES_ROUTES = {
  root: ROOT,
  TRUST_SCORE: `${ROOT}?${new URLSearchParams({ view: 'trust_score' }).toString()}`,
} as const;

export const MANAGER_FINANCE_TRUST_SCORES_API = {
  LIST: '/api/v1/manager/finance/trust-scores' as const,
  STUDENT: (smartId: string) => `/api/v1/manager/finance/trust-scores/${encodeURIComponent(smartId)}` as const,
  EXPORT_CSV: '/api/v1/manager/finance/trust-scores/export-csv' as const,
} as const;
