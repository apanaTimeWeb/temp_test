// RESPONSIBILITY: Define source-level test coverage for security user sessions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_user_sessions/tests/SuperadminSecurityUserSessionsPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_SECURITY_USER_SESSIONS_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_security_user_sessions.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_security/security_user_sessions preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
