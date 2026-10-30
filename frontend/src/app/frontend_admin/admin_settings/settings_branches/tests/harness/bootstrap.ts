/** Isolated test-scenario vocabulary owned by admin_settings_branches. No sibling imports or live API assumptions. */
export const AdminSettingsBranchesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSettingsBranchesScenario = (typeof AdminSettingsBranchesScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSettingsBranchesScenarioLabel(scenario: AdminSettingsBranchesScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
