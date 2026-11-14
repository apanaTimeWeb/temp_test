// RESPONSIBILITY: Define source-level test coverage for libraries library capacity analysis using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_capacity_analysis/tests/SuperadminLibrariesLibraryCapacityAnalysisPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINACCOUNTINGSEATGAPREPORT_API_CONTRACT_STATUS as contractStatus0 } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/api/superadmin_libraries_overview_library_capacity_analysis.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_libraries/libraries_library_capacity_analysis preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
