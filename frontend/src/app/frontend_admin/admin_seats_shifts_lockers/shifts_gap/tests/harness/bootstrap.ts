/** Isolated test-scenario vocabulary owned by admin_shifts_gap. No sibling imports or live API assumptions. */
export const AdminShiftsGapScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminShiftsGapScenario = (typeof AdminShiftsGapScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminShiftsGapScenarioLabel(scenario: AdminShiftsGapScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
