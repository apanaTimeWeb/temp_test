// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/mocks/handlers/SuperadminCommunicationWhatsappLogsMockHandlers';

/** Isolated MSW lifecycle for communication_whatsapp_logs; tests opt in by calling setupCommunicationWhatsappLogsMockServer(). */
export const COMMUNICATION_WHATSAPP_LOGS_MOCK_SERVER = setupServer(...SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_MSW_HANDLERS);
/**
 * Performs the setup communication whatsapp logs mock server operation within communication whatsapp logs; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupCommunicationWhatsappLogsMockServer(): void {
  beforeAll(() => COMMUNICATION_WHATSAPP_LOGS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => COMMUNICATION_WHATSAPP_LOGS_MOCK_SERVER.resetHandlers());
  afterAll(() => COMMUNICATION_WHATSAPP_LOGS_MOCK_SERVER.close());
}
