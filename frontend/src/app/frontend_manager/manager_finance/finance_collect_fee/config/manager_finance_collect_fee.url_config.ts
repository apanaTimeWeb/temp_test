/** Canonical route configuration owned by manager finance collect fee. */
const ROOT = '/frontend_manager/manager_finance/finance_collect_fee' as const;

export const MANAGER_FINANCE_COLLECT_FEE_ROUTES = {
  root: ROOT,
  COLLECT_FEE: `${ROOT}?${new URLSearchParams({ view: 'collect_fee' }).toString()}`,
} as const;

export const MANAGER_FINANCE_COLLECT_FEE_API = {
  COLLECT: '/api/v1/manager/finance/collect-fee' as const,
  STUDENT_LOOKUP: (query: string) => `/api/v1/manager/finance/collect-fee/lookup?q=${encodeURIComponent(query)}` as const,
  STUDENT_PLAN: (studentId: string) => `/api/v1/manager/finance/collect-fee/student/${encodeURIComponent(studentId)}/plan` as const,
  PAYMENT_MODES: '/api/v1/manager/finance/collect-fee/payment-modes' as const,
} as const;
