// RESPONSIBILITY: Define scenario metadata for billing member refunds; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_billing/billing_member_refunds/mocks/scenarios/superadmin_billing_member_refunds.scenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/**
 * Canonical isolated-harness scenario inventory for this module.
 * The selector switches module-owned MSW handler sets for this verified read-only endpoint.
 * These are deterministic test responses and do not assert production backend behavior.
 */
export const SUPERADMIN_CANONICAL_MOCK_SCENARIOS = [
  { key: 'ACTIVE_RECORDS', label: 'Active records', requiresVerifiedApiContract: false, note: 'Uses the module-owned MSW handler for the verified refunds list endpoint and its local fixtures.' },
  { key: 'EMPTY_DATA', label: 'Empty data', requiresVerifiedApiContract: false, note: 'Uses the module-owned empty-data MSW handler for the verified refunds list endpoint.' },
  { key: 'SERVER_500_ERROR', label: 'Server 500 error', requiresVerifiedApiContract: false, note: 'Uses the module-owned MSW scenario handler for the verified refunds list endpoint.' },
  { key: 'NETWORK_TIMEOUT', label: 'Network timeout', requiresVerifiedApiContract: false, note: 'Uses the module-owned MSW scenario handler for the verified refunds list endpoint.' },
  { key: 'UNAUTHORIZED_401', label: 'Unauthorized 401', requiresVerifiedApiContract: false, note: 'Uses the module-owned MSW scenario handler for the verified refunds list endpoint.' },
  { key: 'FORBIDDEN_403', label: 'Forbidden 403', requiresVerifiedApiContract: false, note: 'Uses the module-owned MSW scenario handler for the verified refunds list endpoint.' },
] as const;

export type SuperadminMockScenarioKey = (typeof SUPERADMIN_CANONICAL_MOCK_SCENARIOS)[number]['key'];
