/** Isolated test-scenario vocabulary owned by admin_members_plans. No sibling imports or live API assumptions. */
export const AdminMembersPlansScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminMembersPlansScenario = (typeof AdminMembersPlansScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminMembersPlansScenarioLabel(scenario: AdminMembersPlansScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
