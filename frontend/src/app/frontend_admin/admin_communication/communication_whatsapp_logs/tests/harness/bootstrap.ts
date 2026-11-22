/** Isolated test-scenario vocabulary owned by admin_communication_whatsapp_logs. No sibling imports or live API assumptions. */
export const AdminCommunicationWhatsappLogsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminCommunicationWhatsappLogsScenario = (typeof AdminCommunicationWhatsappLogsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminCommunicationWhatsappLogsScenarioLabel(scenario: AdminCommunicationWhatsappLogsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
