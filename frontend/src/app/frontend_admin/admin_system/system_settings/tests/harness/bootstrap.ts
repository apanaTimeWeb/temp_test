/** Isolated test-scenario vocabulary owned by admin_system_settings. No sibling imports or live API assumptions. */
export const AdminSystemSettingsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemSettingsScenario = (typeof AdminSystemSettingsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemSettingsScenarioLabel(scenario: AdminSystemSettingsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
