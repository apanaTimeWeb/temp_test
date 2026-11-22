// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/mocks/handlers/SuperadminCommunicationNotificationCenterMockHandlers';

/** Isolated MSW lifecycle for communication_notification_center; tests opt in by calling setupCommunicationNotificationCenterMockServer(). */
export const COMMUNICATION_NOTIFICATION_CENTER_MOCK_SERVER = setupServer(...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_MSW_HANDLERS);
/**
 * Performs the setup communication notification center mock server operation within communication notification center; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupCommunicationNotificationCenterMockServer(): void {
  beforeAll(() => COMMUNICATION_NOTIFICATION_CENTER_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => COMMUNICATION_NOTIFICATION_CENTER_MOCK_SERVER.resetHandlers());
  afterAll(() => COMMUNICATION_NOTIFICATION_CENTER_MOCK_SERVER.close());
}
