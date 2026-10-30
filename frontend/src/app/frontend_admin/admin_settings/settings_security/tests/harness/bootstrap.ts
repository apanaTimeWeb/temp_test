/** Isolated test-scenario vocabulary owned by admin_settings_security. No sibling imports or live API assumptions. */
export const AdminSettingsSecurityScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSettingsSecurityScenario = (typeof AdminSettingsSecurityScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSettingsSecurityScenarioLabel(scenario: AdminSettingsSecurityScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
