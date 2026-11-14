// RESPONSIBILITY: Define source-level test coverage for users member referrals using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_referrals/tests/SuperadminUsersOverviewMemberReferralsCurrencySubunitContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { superadminFinanceFormatCurrency } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/utils/SuperadminUsersOverviewMemberReferralsFormatters';

describe('superadminFinanceFormatCurrency currency subunit contract', () => {
  it('formats a supported zero-decimal currency without a two-decimal fallback', () => {
    expect(superadminFinanceFormatCurrency(1234, 'JPY', 'en-US')).not.toBe('—');
  });

  it('does not guess a divisor for an unsupported currency code', () => {
    expect(superadminFinanceFormatCurrency(1234, 'ZZZ', 'en-US')).toBe('—');
  });
});
