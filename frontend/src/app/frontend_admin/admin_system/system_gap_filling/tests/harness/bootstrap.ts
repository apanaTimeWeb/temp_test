/** Isolated test-scenario vocabulary owned by admin_system_gap_filling. No sibling imports or live API assumptions. */
export const AdminSystemGapFillingScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemGapFillingScenario = (typeof AdminSystemGapFillingScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemGapFillingScenarioLabel(scenario: AdminSystemGapFillingScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
