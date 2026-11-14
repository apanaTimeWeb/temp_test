// RESPONSIBILITY: Define source-level test coverage for navigation shell using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_navigation/navigation_shell/tests/SuperadminNavigationShellPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINNAVIGATIONSHELL_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_navigation_shell.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_navigation/navigation_shell preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
