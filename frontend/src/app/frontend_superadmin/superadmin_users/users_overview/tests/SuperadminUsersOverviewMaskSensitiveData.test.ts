// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewMaskSensitiveData.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_users/users_overview/utils/SuperadminUsersOverviewMaskSensitiveData';

describe('SuperadminUsersOverviewMaskSensitiveData', () => {
  it('partially masks email local and domain names', () => {
    expect(maskSensitiveData('alex@example.com')).toBe('a***@e***.com');
  });

  it('masks phone digits while retaining the last four digits', () => {
    expect(maskSensitiveData('9876543210')).toBe('******3210');
  });
});
