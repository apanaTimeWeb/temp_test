/** Isolated test-scenario vocabulary owned by admin_system_smart_id. No sibling imports or live API assumptions. */
export const AdminSystemSmartIdScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemSmartIdScenario = (typeof AdminSystemSmartIdScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemSmartIdScenarioLabel(scenario: AdminSystemSmartIdScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
