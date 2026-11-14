// RESPONSIBILITY: Define source-level test coverage for security password policy using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_password_policy/tests/SuperadminSecurityPasswordPolicyQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SECURITY_PASSWORD_POLICY_QUERY_KEYS } from '../api/superadmin_security_password_policy.query_keys';

describe('security_password_policy canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_SECURITY_PASSWORD_POLICY_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_security', 'security_password_policy']);
    expect(SUPERADMIN_SECURITY_PASSWORD_POLICY_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_SECURITY_PASSWORD_POLICY_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_SECURITY_PASSWORD_POLICY_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_SECURITY_PASSWORD_POLICY_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
