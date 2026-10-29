// @vitest-environment jsdom
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import messages from '@/app/frontend_manager/manager_members/members_referral_bonus/locales/manager_members_referral_bonus_domain_en.json';
import { ManagerMembersReferralBonusReferralsClient } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient';

const ui = messages.manager.manager_referral_bonus.ui;

function renderReferralScreen() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ManagerMembersReferralBonusReferralsClient />
    </NextIntlClientProvider>,
  );
}

describe('ManagerMembersReferralBonus fail-closed UI contract', () => {
  it('announces the missing referral contract and keeps create/search/filter controls disabled', () => {
    renderReferralScreen();

    expect(screen.getByTestId('manager-students-referrals-contract-warning')).toBeTruthy();
    const createButton = screen.getByRole('button', { name: ui.new_referral_unavailable });
    const searchInput = screen.getByRole('textbox', { name: ui.referral_search_unavailable });
    const filterButton = screen.getByRole('button', { name: ui.filters_unavailable });

    expect((createButton as HTMLButtonElement).disabled).toBe(true);
    expect((searchInput as HTMLInputElement).disabled).toBe(true);
    expect((filterButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('does not fabricate referral rows or derived KPI totals when no live contract exists', () => {
    renderReferralScreen();

    expect(screen.queryAllByRole('row')).toHaveLength(0);
    expect(screen.getAllByText('—')).toHaveLength(3);
  });
});
