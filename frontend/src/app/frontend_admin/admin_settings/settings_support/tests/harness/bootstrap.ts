/** Isolated test-scenario vocabulary owned by admin_settings_support. No sibling imports or live API assumptions. */
export const AdminSettingsSupportScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSettingsSupportScenario = (typeof AdminSettingsSupportScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSettingsSupportScenarioLabel(scenario: AdminSettingsSupportScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
