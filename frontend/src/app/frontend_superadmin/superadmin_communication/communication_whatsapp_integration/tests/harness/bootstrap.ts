// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/mocks/handlers/SuperadminCommunicationWhatsappIntegrationMockHandlers';

/** Isolated MSW lifecycle for communication_whatsapp_integration; tests opt in by calling setupSystemWhatsappIntegrationMockServer(). */
export const SYSTEM_WHATSAPP_INTEGRATION_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_MSW_HANDLERS);
/**
 * Performs the setup system whatsapp integration mock server operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemWhatsappIntegrationMockServer(): void {
  beforeAll(() => SYSTEM_WHATSAPP_INTEGRATION_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_WHATSAPP_INTEGRATION_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_WHATSAPP_INTEGRATION_MOCK_SERVER.close());
}
