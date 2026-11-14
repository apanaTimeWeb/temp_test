// RESPONSIBILITY: Define scenario metadata for libraries library shift gap analysis; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_libraries/libraries_library_shift_gap_analysis/mocks/scenarios/superadmin_libraries_library_shift_gap_analysis.scenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/**
 * Canonical isolated-harness scenario inventory for this module.
 * The selector is a deterministic harness control, not evidence of a live backend contract.
 * Network-backed states remain non-executable until this module receives a verified endpoint/auth contract.
 */
export const SUPERADMIN_CANONICAL_MOCK_SCENARIOS = [
  { key: 'ACTIVE_RECORDS', label: 'Active records', requiresVerifiedApiContract: false, note: 'Harness selection state; feature data is supplied only by module-local fixtures or approved handlers.' },
  { key: 'EMPTY_DATA', label: 'Empty data', requiresVerifiedApiContract: false, note: 'Harness selection state; a real empty response is not fabricated without a module-local fixture or approved handler.' },
  { key: 'SERVER_500_ERROR', label: 'Server 500 error', requiresVerifiedApiContract: true, note: 'Requires a verified endpoint contract before a network response can be simulated.' },
  { key: 'NETWORK_TIMEOUT', label: 'Network timeout', requiresVerifiedApiContract: true, note: 'Requires a verified endpoint contract before a network response can be simulated.' },
  { key: 'UNAUTHORIZED_401', label: 'Unauthorized 401', requiresVerifiedApiContract: true, note: 'Requires a verified authentication contract before a network response can be simulated.' },
  { key: 'FORBIDDEN_403', label: 'Forbidden 403', requiresVerifiedApiContract: true, note: 'Requires a verified authorization contract before a network response can be simulated.' },
] as const;

export type SuperadminMockScenarioKey = (typeof SUPERADMIN_CANONICAL_MOCK_SCENARIOS)[number]['key'];
