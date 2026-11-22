// RESPONSIBILITY: Define scenario metadata for system backup configuration; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_system/system_backup_configuration/mocks/scenarios/SuperadminBackupConfigurationbackup_configuration.MockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** UI-only test scenarios; these names do not imply backend endpoints. */
export const SUPERADMIN_SYSTEM_BACKUPS_SCENARIOS = [
  'loading',
  'empty',
  'error',
  'unavailable_mutation',
] as const;

/**
 * Canonical 8-state scenario inventory for checklist traceability. This metadata does not
 * invent request URLs, response fields, authorization rules, or write behavior. Network-backed
 * states remain non-executable until verified host contracts and handlers are supplied.
 */
export const SUPERADMIN_BACKUP_CONFIGURATION_CANONICAL_SCENARIOS = [
  { id: 'ACTIVE', description: "fixture-backed active/loaded view; payload must come from this leaf fixture", executableWithoutBackendContract: true },
  { id: 'EMPTY', description: "empty collection view", executableWithoutBackendContract: true },
  { id: 'SERVER_500', description: "server failure response; runnable only with an approved endpoint contract", executableWithoutBackendContract: false },
  { id: 'TIMEOUT', description: "network timeout; runnable only with an approved endpoint contract", executableWithoutBackendContract: false },
  { id: 'UNAUTHORIZED', description: "unauthorized response; runnable only with an approved auth contract", executableWithoutBackendContract: false },
  { id: 'LOADING', description: "pending request state", executableWithoutBackendContract: true },
  { id: 'MUTATION_FAILURE', description: "mutation failure; runnable only with an approved mutation contract", executableWithoutBackendContract: false },
  { id: 'UNAVAILABLE_MUTATION', description: "safe disabled/unavailable mutation state when write contract is absent", executableWithoutBackendContract: true },
] as const;
