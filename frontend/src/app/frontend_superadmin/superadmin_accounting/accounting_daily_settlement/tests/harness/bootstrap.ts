// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_DAILY_SETTLEMENT_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/mocks/handlers/SuperadminAccountingDailySettlementMockHandlers';

/** Isolated MSW lifecycle for accounting_daily_settlement; tests opt in by calling setupAccountingDailySettlementMockServer(). */
export const ACCOUNTING_DAILY_SETTLEMENT_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_DAILY_SETTLEMENT_MSW_HANDLERS);
/**
 * Performs the setup accounting daily settlement mock server operation within accounting daily settlement; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingDailySettlementMockServer(): void {
  beforeAll(() => ACCOUNTING_DAILY_SETTLEMENT_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_DAILY_SETTLEMENT_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_DAILY_SETTLEMENT_MOCK_SERVER.close());
}
