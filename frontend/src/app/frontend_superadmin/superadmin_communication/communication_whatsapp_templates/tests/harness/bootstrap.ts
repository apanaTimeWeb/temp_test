// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/mocks/handlers/SuperadminCommunicationWhatsappTemplatesMockHandlers';

/** Isolated MSW lifecycle for communication_whatsapp_templates; tests opt in by calling setupCommunicationWhatsappTemplatesMockServer(). */
export const COMMUNICATION_WHATSAPP_TEMPLATES_MOCK_SERVER = setupServer(...SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_MSW_HANDLERS);
/**
 * Performs the setup communication whatsapp templates mock server operation within communication whatsapp templates; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupCommunicationWhatsappTemplatesMockServer(): void {
  beforeAll(() => COMMUNICATION_WHATSAPP_TEMPLATES_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => COMMUNICATION_WHATSAPP_TEMPLATES_MOCK_SERVER.resetHandlers());
  afterAll(() => COMMUNICATION_WHATSAPP_TEMPLATES_MOCK_SERVER.close());
}
