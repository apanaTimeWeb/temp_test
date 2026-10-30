/** Isolated test-scenario vocabulary owned by admin_system_power_saving. No sibling imports or live API assumptions. */
export const AdminSystemPowerSavingScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemPowerSavingScenario = (typeof AdminSystemPowerSavingScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemPowerSavingScenarioLabel(scenario: AdminSystemPowerSavingScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
