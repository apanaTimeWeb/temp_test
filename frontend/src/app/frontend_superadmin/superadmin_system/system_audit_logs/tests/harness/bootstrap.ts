// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_AUDIT_LOGS_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/mocks/handlers/SuperadminAuditLogsOverviewMockHandlers';

/** Isolated MSW lifecycle for audit_logs; tests opt in by calling setupAuditLogsOverviewMockServer(). */
export const AUDIT_LOGS_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_AUDIT_LOGS_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup audit logs overview mock server operation within audit logs; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAuditLogsOverviewMockServer(): void {
  beforeAll(() => AUDIT_LOGS_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => AUDIT_LOGS_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => AUDIT_LOGS_OVERVIEW_MOCK_SERVER.close());
}
