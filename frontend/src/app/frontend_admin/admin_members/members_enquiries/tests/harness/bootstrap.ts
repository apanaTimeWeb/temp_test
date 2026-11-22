/** Isolated test-scenario vocabulary owned by admin_members_enquiries. No sibling imports or live API assumptions. */
export const AdminMembersEnquiriesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminMembersEnquiriesScenario = (typeof AdminMembersEnquiriesScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminMembersEnquiriesScenarioLabel(scenario: AdminMembersEnquiriesScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
