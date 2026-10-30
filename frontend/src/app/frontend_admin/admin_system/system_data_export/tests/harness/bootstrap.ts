/** Isolated test-scenario vocabulary owned by admin_system_data_export. No sibling imports or live API assumptions. */
export const AdminSystemDataExportScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemDataExportScenario = (typeof AdminSystemDataExportScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemDataExportScenarioLabel(scenario: AdminSystemDataExportScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
