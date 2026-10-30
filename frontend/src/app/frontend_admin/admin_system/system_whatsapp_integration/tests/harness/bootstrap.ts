/** Isolated test-scenario vocabulary owned by admin_system_whatsapp_integration. No sibling imports or live API assumptions. */
export const AdminSystemWhatsappIntegrationScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminSystemWhatsappIntegrationScenario = (typeof AdminSystemWhatsappIntegrationScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSystemWhatsappIntegrationScenarioLabel(scenario: AdminSystemWhatsappIntegrationScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
