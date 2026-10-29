/**
 * UI scenario registry for isolated feature verification.
 * Failure/auth cases remain registry-only until authoritative host contracts are supplied.
 */
export const MANAGER_FINANCE_COLLECT_FEE_SCENARIOS = {
  ACTIVE: { id: 'ACTIVE', kind: 'ui-state' },
  EMPTY: { id: 'EMPTY', kind: 'ui-state' },
  LOADING: { id: 'LOADING', kind: 'ui-state' },
  ERROR: { id: 'ERROR', kind: 'ui-state' },
  RECOVERY: { id: 'RECOVERY', kind: 'ui-state' },
  SERVER_500: { id: 'SERVER_500', kind: 'host-contract-required' },
  TIMEOUT: { id: 'TIMEOUT', kind: 'host-contract-required' },
  UNAUTHORIZED: { id: 'UNAUTHORIZED', kind: 'host-auth-contract-required' },
} as const;
export type FinanceCollectFeeScenario = keyof typeof MANAGER_FINANCE_COLLECT_FEE_SCENARIOS;
export const DEFAULT_FINANCE_COLLECT_FEE_SCENARIO: FinanceCollectFeeScenario = 'ACTIVE';
