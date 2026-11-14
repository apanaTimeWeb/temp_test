// RESPONSIBILITY: Record the canonical eight-state navigation-shell coverage contract without inventing network endpoints or making unverified responses executable.
// FLOW: Navigation-shell feature contract -> isolated scenario traceability catalog -> harness/test coverage planning.
/**
 * Canonical 8-state traceability inventory. Network/auth states are metadata only until the host supplies verified API and auth contracts.
 */
export const SUPERADMIN_NAVIGATION_SHELL_CANONICAL_SCENARIOS = [
  { id: 'ACTIVE', description: 'Fixture-backed navigation shell with the normal menu and header.', executableWithoutBackendContract: true },
  { id: 'EMPTY', description: 'Empty optional notification/menu fixture state.', executableWithoutBackendContract: true },
  { id: 'LOADING', description: 'Navigation shell pending state while the host supplies navigation/session context.', executableWithoutBackendContract: true },
  { id: 'SERVER_500', description: 'Server error boundary; executable only with an approved host endpoint contract.', executableWithoutBackendContract: false },
  { id: 'TIMEOUT', description: 'Network timeout boundary; executable only with an approved host endpoint contract.', executableWithoutBackendContract: false },
  { id: 'UNAUTHORIZED', description: 'Unauthorized host session boundary; requires the host authentication contract.', executableWithoutBackendContract: false },
  { id: 'MUTATION_FAILURE', description: 'Mutation failure boundary; no mutation behavior is inferred for the navigation shell.', executableWithoutBackendContract: false },
  { id: 'UNAVAILABLE_MUTATION', description: 'Unavailable mutation control remains disabled or explanatory when no write contract exists.', executableWithoutBackendContract: true },
] as const;
