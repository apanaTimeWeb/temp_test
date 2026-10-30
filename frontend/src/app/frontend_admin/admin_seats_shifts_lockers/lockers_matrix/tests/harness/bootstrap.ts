/** Isolated test-scenario vocabulary owned by admin_lockers_matrix. No sibling imports or live API assumptions. */
export const AdminLockersMatrixScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminLockersMatrixScenario = (typeof AdminLockersMatrixScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminLockersMatrixScenarioLabel(scenario: AdminLockersMatrixScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
