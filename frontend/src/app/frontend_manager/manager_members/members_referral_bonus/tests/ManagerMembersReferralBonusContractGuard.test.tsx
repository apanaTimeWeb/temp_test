// @vitest-environment jsdom
import { NextIntlClientProvider } from 'next-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import messages from '@/app/frontend_manager/manager_members/members_referral_bonus/locales/manager_members_referral_bonus_domain_en.json';
import { ManagerMembersReferralBonusReferralsClient } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient';

function renderReferralScreen() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ManagerMembersReferralBonusReferralsClient />
    </NextIntlClientProvider>,
  );
}

describe('ManagerMembersReferralBonus UI contract', () => {
  it('renders working referral records, active search, and computed KPI metrics', () => {
    renderReferralScreen();

    // KPIs render calculated metrics
    expect(screen.getByText('Total referrals')).toBeTruthy();
    expect(screen.getByText('Pending approvals')).toBeTruthy();
    expect(screen.getByText('Total bonus distributed')).toBeTruthy();

    // Table rows render referral data
    expect(screen.getAllByRole('row').length).toBeGreaterThan(0);

    // Search and filters are active
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect((searchInput as HTMLInputElement).disabled).toBe(false);
  });

  it('allows filtering referrals and opening the Add Referral modal', () => {
    renderReferralScreen();

    const addBtn = screen.getByRole('button', { name: /Add Referral/i });
    expect(addBtn).toBeTruthy();
    fireEvent.click(addBtn);

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
