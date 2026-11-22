// @vitest-environment jsdom
import { ManagerMembersReferralBonusReferralsClient } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient';
import messages from '@/app/frontend_manager/manager_members/members_referral_bonus/locales/manager_members_referral_bonus_domain_en.json';
import {
applyReferralBonusToNextRenewal,
getReferralRenewalFinanceUrl,
parseBonusNumber,
parseReferrerInfo,
} from '@/app/frontend_manager/manager_members/members_referral_bonus/utils/ManagerMembersReferralBonusRenewalAdjustment';
import { fireEvent,render,screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach,describe,expect,it,vi } from 'vitest';

describe('ManagerMembersReferralBonusRenewalAdjustment', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Utility Functions', () => {
    it('parseBonusNumber parses numeric value from string formats', () => {
      expect(parseBonusNumber('₹500')).toBe(500);
      expect(parseBonusNumber('₹300')).toBe(300);
      expect(parseBonusNumber('200')).toBe(200);
      expect(parseBonusNumber(450)).toBe(450);
      expect(parseBonusNumber('invalid')).toBe(500);
    });

    it('parseReferrerInfo parses name, ID and matches member candidate', () => {
      const details = parseReferrerInfo('Amit Sharma (LIB-1042)');
      expect(details.name).toBe('Amit Sharma');
      expect(details.smartId).toBe('LIB-1042');
      expect(details.phone).toBe('9876543210');
      expect(details.monthlyFee).toBe(1800);
    });

    it('getReferralRenewalFinanceUrl generates deep link to finance renewals desk', () => {
      const url = getReferralRenewalFinanceUrl('Amit Sharma', 500, 'REF-101');
      expect(url).toContain('/frontend_manager/manager_finance/finance_renewals?');
      expect(url).toContain('name=Amit+Sharma');
      expect(url).toContain('discount=500');
      expect(url).toContain('refId=REF-101');
    });

    it('applyReferralBonusToNextRenewal stores ledger record and dispatches sync event', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      // Pre-seed a member in directory
      localStorage.setItem(
        'manager_member_records',
        JSON.stringify([
          {
            id: 'LIB-1042',
            name: 'Amit Sharma',
            remarks: 'Active candidate',
          },
        ])
      );

      const result = applyReferralBonusToNextRenewal(
        'REF-101',
        'Amit Sharma (LIB-1042)',
        'Rohan Verma',
        500
      );

      expect(result.success).toBe(true);
      expect(result.netFee).toBe(1300); // 1800 - 500

      // Check renewals ledger
      const rawLedger = localStorage.getItem('manager_referral_renewals_ledger');
      expect(rawLedger).not.toBeNull();
      const ledger = JSON.parse(rawLedger!);
      expect(ledger.length).toBe(1);
      expect(ledger[0].referralId).toBe('REF-101');
      expect(ledger[0].referrerName).toBe('Amit Sharma');
      expect(ledger[0].discountAmount).toBe(500);
      expect(ledger[0].netFee).toBe(1300);

      // Check member remarks updated
      const rawMembers = localStorage.getItem('manager_member_records');
      const members = JSON.parse(rawMembers!);
      expect(members[0].remarks).toContain('Referral Bonus Applied: -₹500 for referring Rohan Verma (Ref: REF-101)');
      expect(members[0].renewalDiscountDue).toBe(500);

      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('UI Integration', () => {
    it('renders "Apply to Renewal" button on referral table rows and opens renewal modal', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ManagerMembersReferralBonusReferralsClient />
        </NextIntlClientProvider>
      );

      // Verify the Apply to Renewal button is rendered for unadjusted rows
      const applyButtons = screen.getAllByRole('button', { name: /Apply to Renewal/i });
      expect(applyButtons.length).toBeGreaterThan(0);

      // Click first Apply to Renewal button
      fireEvent.click(applyButtons[0]);

      // Verify Apply to Renewal modal opens
      expect(screen.getByRole('dialog', { name: /Apply Referral Bonus to Renewal/i })).toBeTruthy();
      expect(screen.getByText(/Renewal Discount Amount \(₹\)/i)).toBeTruthy();
      expect(screen.getByText(/Net Payable Renewal Fee/i)).toBeTruthy();

      // Check preset chips: 200, 300, 500
      expect(screen.getByRole('button', { name: '₹200' })).toBeTruthy();
      expect(screen.getByRole('button', { name: '₹300' })).toBeTruthy();
      expect(screen.getByRole('button', { name: '₹500' })).toBeTruthy();

      // Click preset chip ₹300
      fireEvent.click(screen.getByRole('button', { name: '₹300' }));
      expect(screen.getByText('₹1,500')).toBeTruthy(); // 1800 - 300 = 1500

      // Submit modal
      const submitBtn = screen.getByRole('button', { name: /Apply to Next Renewal/i });
      fireEvent.click(submitBtn);

      // Verify ledger has been recorded in localStorage
      const rawLedger = localStorage.getItem('manager_referral_renewals_ledger');
      expect(rawLedger).not.toBeNull();
    });
  });
});
