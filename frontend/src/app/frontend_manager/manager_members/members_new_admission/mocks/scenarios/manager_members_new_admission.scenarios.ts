/**
 * UI scenario registry for isolated feature verification.
 * Failure/auth cases remain registry-only until authoritative host contracts are supplied.
 */
export const MANAGER_MEMBERS_NEW_ADMISSION_SCENARIOS = {
  ACTIVE: { id: 'ACTIVE', kind: 'ui-state' },
  EMPTY: { id: 'EMPTY', kind: 'ui-state' },
  LOADING: { id: 'LOADING', kind: 'ui-state' },
  ERROR: { id: 'ERROR', kind: 'ui-state' },
  RECOVERY: { id: 'RECOVERY', kind: 'ui-state' },
  SERVER_500: { id: 'SERVER_500', kind: 'host-contract-required' },
  TIMEOUT: { id: 'TIMEOUT', kind: 'host-contract-required' },
  UNAUTHORIZED: { id: 'UNAUTHORIZED', kind: 'host-auth-contract-required' },
} as const;
export type MembersNewAdmissionScenario = keyof typeof MANAGER_MEMBERS_NEW_ADMISSION_SCENARIOS;
export const DEFAULT_MEMBERS_NEW_ADMISSION_SCENARIO: MembersNewAdmissionScenario = 'ACTIVE';
