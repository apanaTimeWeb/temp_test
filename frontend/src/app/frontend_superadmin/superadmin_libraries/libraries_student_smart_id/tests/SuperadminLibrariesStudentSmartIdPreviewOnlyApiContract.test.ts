// RESPONSIBILITY: Define source-level test coverage for libraries student smart id using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_student_smart_id/tests/SuperadminLibrariesStudentSmartIdPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINSYSTEMSMARTID_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_libraries_onboarding_setup_student_smart_id.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_libraries/libraries_student_smart_id preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
