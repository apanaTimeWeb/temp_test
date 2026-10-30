/** Isolated test-scenario vocabulary owned by admin_members_students. No sibling imports or live API assumptions. */
export const AdminMembersStudentsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminMembersStudentsScenario = (typeof AdminMembersStudentsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminMembersStudentsScenarioLabel(scenario: AdminMembersStudentsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
