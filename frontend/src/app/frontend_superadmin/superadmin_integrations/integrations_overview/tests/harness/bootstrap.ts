// tests/harness/bootstrap.ts
// RESPONSIBILITY: Provide the isolated feature-local MSW server test harness lifecycle.
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { superadminIntegrationsOverviewHandlers } from '../../mocks/handlers/superadmin_integrations_overview.handlers';

export const INTEGRATIONS_OVERVIEW_MOCK_SERVER = setupServer(...superadminIntegrationsOverviewHandlers);

export function setupIntegrationsOverviewMockServer(): void {
  beforeAll(() => INTEGRATIONS_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'warn' }));
  afterEach(() => INTEGRATIONS_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => INTEGRATIONS_OVERVIEW_MOCK_SERVER.close());
}
