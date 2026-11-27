import { AdminFinanceReferralPayoutVoucherModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralPayoutVoucherModal';
import { AdminFinanceReferralsRedeemModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsRedeemModal';
import { AdminFinanceReferralsTable } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTable';
import type { AdminFinanceDemoReferrer, ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AdminFinanceReferrals Controls & Payout Flows', () => {
  const mockReferrer: AdminFinanceDemoReferrer = {
    id: 1,
    name: 'Rahul Kumar',
    smartId: 'STU101',
    referredNames: ['Priya S', 'Aman V'],
    bonusEarned: 50000,
    redeemed: 30000,
    balance: 20000,
    branch: 'Downtown Central',
  };

  it('renders Redeem button on referrer table row when balance > 0', () => {
    const handleRedeem = vi.fn();
    render(
      <AdminFinanceReferralsTable
        paginatedReferrers={[mockReferrer]}
        filteredCount={1}
        page={0}
        pageSize={10}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        isLoading={false}
        sortField={null}
        sortDirection="asc"
        onToggleSort={vi.fn()}
        expandedId={null}
        onToggleExpand={vi.fn()}
        onRedeem={handleRedeem}
      />,
    );

    const redeemBtn = screen.getByRole('button', { name: /Redeem referral bonus for Rahul Kumar/i });
    expect(redeemBtn).toBeTruthy();
    fireEvent.click(redeemBtn);
    expect(handleRedeem).toHaveBeenCalledWith(mockReferrer);
  });

  it('shows Settled badge when balance is 0', () => {
    const settledReferrer: AdminFinanceDemoReferrer = {
      ...mockReferrer,
      id: 2,
      redeemed: 50000,
      balance: 0,
    };

    render(
      <AdminFinanceReferralsTable
        paginatedReferrers={[settledReferrer]}
        filteredCount={1}
        page={0}
        pageSize={10}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        isLoading={false}
        sortField={null}
        sortDirection="asc"
        onToggleSort={vi.fn()}
        expandedId={null}
        onToggleExpand={vi.fn()}
      />,
    );

    expect(screen.getByText(/Settled/i)).toBeTruthy();
  });

  it('handles fee adjustment and cash/upi in AdminFinanceReferralsRedeemModal', () => {
    const handleConfirm = vi.fn();
    render(
      <AdminFinanceReferralsRedeemModal
        referrer={mockReferrer}
        isOpen={true}
        onClose={vi.fn()}
        onConfirmRedeem={handleConfirm}
      />,
    );

    expect(screen.getByText(/Disburse Referral Bonus/i)).toBeTruthy();
    expect(screen.getByText(/Adjust in Next Fee/i)).toBeTruthy();
    expect(screen.getByText(/Disburse Cash \/ UPI/i)).toBeTruthy();

    const submitBtn = screen.getByRole('button', { name: /Confirm Disbursement/i });
    fireEvent.click(submitBtn);

    expect(handleConfirm).toHaveBeenCalledWith(1, 20000, 'fee_adjustment', expect.any(String), expect.anything());
  });

  it('allows redeeming bonus by adjusting into next month fee with Credit Note', () => {
    const referrer: AdminFinanceDemoReferrer = {
      id: 101,
      name: 'Aditya Verma',
      smartId: 'SL-2026-081',
      referredNames: ['Pooja Sharma', 'Kunal Shah', 'Vikas Mehra'],
      bonusEarned: 150000,
      redeemed: 100000,
      balance: 50000,
      branch: 'Downtown Central',
    };
    const onConfirm = vi.fn();

    render(
      <AdminFinanceReferralsRedeemModal
        referrer={referrer}
        isOpen={true}
        onClose={vi.fn()}
        onConfirmRedeem={onConfirm}
      />,
    );

    expect(screen.getByText(/Adjust in Next Fee/i)).toBeDefined();
    expect(screen.getByText(/Generated Invoice Credit Note:/i)).toBeDefined();

    fireEvent.click(screen.getByTestId('admin-confirm-referral-disbursement-btn'));
    expect(onConfirm).toHaveBeenCalledWith(
      101,
      50000,
      'fee_adjustment',
      expect.any(String),
      expect.objectContaining({ invoiceCreditNote: expect.stringContaining('CR-REF-') }),
    );
  });

  it('allows redeeming bonus via Cash/UPI with Transaction UTR input and printable voucher', () => {
    const referrer: AdminFinanceDemoReferrer = {
      id: 101,
      name: 'Aditya Verma',
      smartId: 'SL-2026-081',
      referredNames: ['Pooja Sharma', 'Kunal Shah', 'Vikas Mehra'],
      bonusEarned: 150000,
      redeemed: 100000,
      balance: 50000,
      branch: 'Downtown Central',
    };
    const onConfirm = vi.fn();

    render(
      <AdminFinanceReferralsRedeemModal
        referrer={referrer}
        isOpen={true}
        onClose={vi.fn()}
        onConfirmRedeem={onConfirm}
      />,
    );

    fireEvent.click(screen.getByText(/Disburse Cash \/ UPI/i));
    const utrInput = screen.getByPlaceholderText(/412398512401/i);
    expect(utrInput).toBeDefined();
    fireEvent.change(utrInput, { target: { value: '419900228811' } });
    fireEvent.click(screen.getByTestId('admin-confirm-referral-disbursement-btn'));

    expect(onConfirm).toHaveBeenCalledWith(
      101,
      50000,
      'cash_upi',
      expect.any(String),
      expect.objectContaining({ subChannel: 'UPI Transfer', utrReference: '419900228811' }),
    );
  });

  it('renders the printable Referral Payout Voucher modal with print and details', () => {
    const mockVoucher: ReferralPayoutVoucher = {
      voucherId: 'PV-REF-2026-9041',
      referrerId: 101,
      studentName: 'Aditya Verma',
      smartId: 'SL-2026-081',
      branch: 'Downtown Central',
      amountMinor: 50000,
      mode: 'cash_upi',
      subChannel: 'UPI Transfer',
      utrReference: '419900228811',
      disbursedAt: '18 Nov 2026',
      authorizedBy: 'Smart Library Accounts',
      notes: 'Referral reward payout cleared',
    };

    render(
      <AdminFinanceReferralPayoutVoucherModal
        voucher={mockVoucher}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('PV-REF-2026-9041')).toBeDefined();
    expect(screen.getByText('Aditya Verma')).toBeDefined();
    expect(screen.getByText('419900228811')).toBeDefined();
    expect(screen.getByTestId('admin-print-referral-voucher-btn')).toBeDefined();
  });
});
