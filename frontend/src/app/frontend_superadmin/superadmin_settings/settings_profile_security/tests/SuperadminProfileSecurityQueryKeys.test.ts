// RESPONSIBILITY: Define source-level test coverage for settings profile security using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_security/tests/SuperadminProfileSecurityQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_PROFILE_SECURITY_QUERY_KEYS } from '../api/superadmin_profile_security.query_keys';

describe('profile_security canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_PROFILE_SECURITY_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_settings', 'profile_security']);
    expect(SUPERADMIN_PROFILE_SECURITY_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_PROFILE_SECURITY_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_PROFILE_SECURITY_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_PROFILE_SECURITY_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
