/** Isolated test-scenario vocabulary owned by admin_shifts_management. No sibling imports or live API assumptions. */
export const AdminShiftsManagementScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminShiftsManagementScenario = (typeof AdminShiftsManagementScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminShiftsManagementScenarioLabel(scenario: AdminShiftsManagementScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
