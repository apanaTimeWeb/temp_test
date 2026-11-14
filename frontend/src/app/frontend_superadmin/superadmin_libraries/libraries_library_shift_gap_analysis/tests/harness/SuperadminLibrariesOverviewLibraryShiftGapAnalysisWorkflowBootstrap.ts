// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_SHIFT_GAP_ANALYZER_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/mocks/handlers/SuperadminLibrariesOverviewLibraryShiftGapAnalysisMockHandlers';

/** Isolated MSW lifecycle for library_shift_gap_analysis; tests opt in by calling setupAccountingShiftGapAnalyzerMockServer(). */
export const ACCOUNTING_SHIFT_GAP_ANALYZER_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_SHIFT_GAP_ANALYZER_MSW_HANDLERS);
/**
 * Performs the setup accounting shift gap analyzer mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingShiftGapAnalyzerMockServer(): void {
  beforeAll(() => ACCOUNTING_SHIFT_GAP_ANALYZER_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_SHIFT_GAP_ANALYZER_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_SHIFT_GAP_ANALYZER_MOCK_SERVER.close());
}
