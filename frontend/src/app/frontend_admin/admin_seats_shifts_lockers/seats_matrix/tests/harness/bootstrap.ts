/** Isolated test-scenario vocabulary owned by admin_seats_matrix. No sibling imports or live API assumptions. */
export const AdminSeatsMatrixScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSeatsMatrixScenario = (typeof AdminSeatsMatrixScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSeatsMatrixScenarioLabel(scenario: AdminSeatsMatrixScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
