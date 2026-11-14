// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SUPPORT_COMPLAINTS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/mocks/handlers/SuperadminSupportComplaintsMockHandlers';

/** Isolated MSW lifecycle for support_complaints; tests opt in by calling setupCommunicationComplaintsMockServer(). */
export const COMMUNICATION_COMPLAINTS_MOCK_SERVER = setupServer(...SUPERADMIN_SUPPORT_COMPLAINTS_MSW_HANDLERS);
/**
 * Performs the setup communication complaints mock server operation within support complaints; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupCommunicationComplaintsMockServer(): void {
  beforeAll(() => COMMUNICATION_COMPLAINTS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => COMMUNICATION_COMPLAINTS_MOCK_SERVER.resetHandlers());
  afterAll(() => COMMUNICATION_COMPLAINTS_MOCK_SERVER.close());
}
