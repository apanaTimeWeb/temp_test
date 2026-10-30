/** Isolated test-scenario vocabulary owned by admin_system_branding. No sibling imports or live API assumptions. */
export const AdminSystemBrandingScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemBrandingScenario = (typeof AdminSystemBrandingScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemBrandingScenarioLabel(scenario: AdminSystemBrandingScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
