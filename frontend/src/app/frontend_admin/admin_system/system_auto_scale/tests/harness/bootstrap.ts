/** Isolated test-scenario vocabulary owned by admin_system_auto_scale. No sibling imports or live API assumptions. */
export const AdminSystemAutoScaleScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemAutoScaleScenario = (typeof AdminSystemAutoScaleScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemAutoScaleScenarioLabel(scenario: AdminSystemAutoScaleScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
