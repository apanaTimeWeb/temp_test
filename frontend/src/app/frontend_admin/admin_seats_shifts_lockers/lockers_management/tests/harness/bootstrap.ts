/** Isolated test-scenario vocabulary owned by admin_lockers_management. No sibling imports or live API assumptions. */
export const AdminLockersManagementScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminLockersManagementScenario = (typeof AdminLockersManagementScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminLockersManagementScenarioLabel(scenario: AdminLockersManagementScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
