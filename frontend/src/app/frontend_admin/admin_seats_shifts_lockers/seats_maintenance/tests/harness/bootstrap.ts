/** Isolated test-scenario vocabulary owned by admin_seats_maintenance. No sibling imports or live API assumptions. */
export const AdminSeatsMaintenanceScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSeatsMaintenanceScenario = (typeof AdminSeatsMaintenanceScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSeatsMaintenanceScenarioLabel(scenario: AdminSeatsMaintenanceScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
