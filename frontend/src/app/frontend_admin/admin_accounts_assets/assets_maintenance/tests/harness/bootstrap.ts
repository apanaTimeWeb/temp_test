/** Isolated test-scenario vocabulary owned by admin_assets_maintenance. No sibling imports or live API assumptions. */
export const AdminAssetsMaintenanceScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAssetsMaintenanceScenario = (typeof AdminAssetsMaintenanceScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminAssetsMaintenanceScenarioLabel(scenario: AdminAssetsMaintenanceScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
