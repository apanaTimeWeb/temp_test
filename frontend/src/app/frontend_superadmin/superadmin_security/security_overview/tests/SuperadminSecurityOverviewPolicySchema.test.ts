// RESPONSIBILITY: Define source-level test coverage for security overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_overview/tests/SuperadminSecurityOverviewPolicySchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import {
  SUPERADMIN_SECURITY_LOGIN_SCHEMA,
  SUPERADMIN_SECURITY_PASSWORD_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_security/security_overview/schemas/SuperadminSecurityOverviewPolicySchema';

describe('superadmin security policy schemas', () => {
  it('accepts the documented login policy bounds', () => {
    expect(SUPERADMIN_SECURITY_LOGIN_SCHEMA.safeParse({
      maxFailed: 5,
      lockDuration: 30,
      sessionTimeout: 60,
      forceLogout: false,
    }).success).toBe(true);
  });

  it('rejects out-of-range login thresholds', () => {
    expect(SUPERADMIN_SECURITY_LOGIN_SCHEMA.safeParse({
      maxFailed: 0,
      lockDuration: 30,
      sessionTimeout: 60,
      forceLogout: false,
    }).success).toBe(false);
  });

  it('accepts a valid password policy and rejects insecure minimum lengths', () => {
    const base = { upper: true, symbol: true, length: 12, expiry: 90 };
    expect(SUPERADMIN_SECURITY_PASSWORD_SCHEMA.safeParse(base).success).toBe(true);
    expect(SUPERADMIN_SECURITY_PASSWORD_SCHEMA.safeParse({ ...base, length: 7 }).success).toBe(false);
  });
});
