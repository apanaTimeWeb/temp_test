// RESPONSIBILITY: Define source-level test coverage for security mfa using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_mfa/tests/SuperadminSecurityMfaQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SECURITY_MFA_QUERY_KEYS } from '../api/superadmin_security_mfa.query_keys';

describe('security_mfa canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_SECURITY_MFA_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_security', 'security_mfa']);
    expect(SUPERADMIN_SECURITY_MFA_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_SECURITY_MFA_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_SECURITY_MFA_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_SECURITY_MFA_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
