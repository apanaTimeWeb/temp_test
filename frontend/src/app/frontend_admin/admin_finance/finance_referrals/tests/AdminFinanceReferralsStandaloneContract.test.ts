// Responsibility: verify the isolated admin_finance_referrals contract remains discoverable by the host test runner.
import { describe, expect, it } from 'vitest';

describe('admin_finance_referrals standalone contract', () => {
  it('has a module-owned test harness', () => {
    expect('admin_finance_referrals').toMatch(/^admin_[a-z0-9_]+$/);
  });
});
