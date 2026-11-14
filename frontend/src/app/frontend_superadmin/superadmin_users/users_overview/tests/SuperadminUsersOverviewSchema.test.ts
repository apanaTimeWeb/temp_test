// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewSchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_FORM_SCHEMA } from '@/app/frontend_superadmin/superadmin_users/users_overview/schemas/SuperadminUsersOverviewSchema';

const VALID_FORM = {
  name: 'Sample User',
  username: 'sample.user',
  email: 'sample.user@example.invalid',
  role: 'Manager',
  branch: 'Sample Tenant',
  twoFactor: true,
} as const;

describe('SuperadminUsersFormSchema', () => {
  it('accepts a complete, valid user preview form', () => {
    expect(SUPERADMIN_USERS_FORM_SCHEMA.safeParse(VALID_FORM).success).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(SUPERADMIN_USERS_FORM_SCHEMA.safeParse({ ...VALID_FORM, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects invalid role values', () => {
    expect(SUPERADMIN_USERS_FORM_SCHEMA.safeParse({ ...VALID_FORM, role: 'Owner' }).success).toBe(false);
  });

  it('rejects blank branch and short usernames', () => {
    expect(SUPERADMIN_USERS_FORM_SCHEMA.safeParse({ ...VALID_FORM, branch: ' ' }).success).toBe(false);
    expect(SUPERADMIN_USERS_FORM_SCHEMA.safeParse({ ...VALID_FORM, username: 'ab' }).success).toBe(false);
  });
});
