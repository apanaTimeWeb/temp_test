/** Isolated test-scenario vocabulary owned by admin_seats_management. No sibling imports or live API assumptions. */
export const AdminSeatsManagementScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSeatsManagementScenario = (typeof AdminSeatsManagementScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSeatsManagementScenarioLabel(scenario: AdminSeatsManagementScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
