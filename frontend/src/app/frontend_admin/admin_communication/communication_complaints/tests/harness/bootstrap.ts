/** Isolated test-scenario vocabulary owned by admin_communication_complaints. No sibling imports or live API assumptions. */
export const AdminCommunicationComplaintsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminCommunicationComplaintsScenario = (typeof AdminCommunicationComplaintsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminCommunicationComplaintsScenarioLabel(scenario: AdminCommunicationComplaintsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
