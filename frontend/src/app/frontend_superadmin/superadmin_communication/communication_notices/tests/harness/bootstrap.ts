// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_COMMUNICATION_NOTICES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/mocks/handlers/SuperadminCommunicationNoticesMockHandlers';

/** Isolated MSW lifecycle for communication_notices; tests opt in by calling setupCommunicationNoticesMockServer(). */
export const COMMUNICATION_NOTICES_MOCK_SERVER = setupServer(...SUPERADMIN_COMMUNICATION_NOTICES_MSW_HANDLERS);
/**
 * Performs the setup communication notices mock server operation within communication notices; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupCommunicationNoticesMockServer(): void {
  beforeAll(() => COMMUNICATION_NOTICES_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers());
  afterAll(() => COMMUNICATION_NOTICES_MOCK_SERVER.close());
}
