/** Isolated test-scenario vocabulary owned by admin_communication_whatsapp_templates. No sibling imports or live API assumptions. */
export const AdminCommunicationWhatsappTemplatesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminCommunicationWhatsappTemplatesScenario = (typeof AdminCommunicationWhatsappTemplatesScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminCommunicationWhatsappTemplatesScenarioLabel(scenario: AdminCommunicationWhatsappTemplatesScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
