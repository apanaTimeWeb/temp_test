// RESPONSIBILITY: Define source-level test coverage for users directory using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_directory/tests/SuperadminUsersDirectoryQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_DIRECTORY_QUERY_KEYS } from '../api/superadmin_users_directory.query_keys';

describe('users_directory canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_USERS_DIRECTORY_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_users', 'users_directory']);
    expect(SUPERADMIN_USERS_DIRECTORY_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_USERS_DIRECTORY_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_USERS_DIRECTORY_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_USERS_DIRECTORY_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
