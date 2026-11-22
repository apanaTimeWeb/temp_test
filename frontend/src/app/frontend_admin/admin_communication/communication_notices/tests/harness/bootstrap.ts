/** Isolated test-scenario vocabulary owned by admin_communication_notices. No sibling imports or live API assumptions. */
export const AdminCommunicationNoticesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminCommunicationNoticesScenario = (typeof AdminCommunicationNoticesScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminCommunicationNoticesScenarioLabel(scenario: AdminCommunicationNoticesScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
