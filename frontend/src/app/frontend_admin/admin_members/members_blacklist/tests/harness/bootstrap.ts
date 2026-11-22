/** Isolated test-scenario vocabulary owned by admin_members_blacklist. No sibling imports or live API assumptions. */
export const AdminMembersBlacklistScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminMembersBlacklistScenario = (typeof AdminMembersBlacklistScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminMembersBlacklistScenarioLabel(scenario: AdminMembersBlacklistScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
