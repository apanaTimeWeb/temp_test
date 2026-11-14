// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/mocks/handlers/SuperadminLibrariesOverviewLibraryCapacityAnalysisMockHandlers';

/** Isolated MSW lifecycle for library_capacity_analysis; tests opt in by calling setupAccountingSeatGapReportMockServer(). */
export const ACCOUNTING_SEAT_GAP_REPORT_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_MSW_HANDLERS);
/**
 * Performs the setup accounting seat gap report mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingSeatGapReportMockServer(): void {
  beforeAll(() => ACCOUNTING_SEAT_GAP_REPORT_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_SEAT_GAP_REPORT_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_SEAT_GAP_REPORT_MOCK_SERVER.close());
}
