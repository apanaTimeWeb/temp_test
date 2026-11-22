import AdminAccountsDailySettlementDiscrepancyModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementDiscrepancyModal';
import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { AdminFinanceReferralPayoutVoucherModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralPayoutVoucherModal';
import { AdminFinanceReferralsRedeemModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsRedeemModal';
import type { AdminFinanceDemoReferrer,ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { AdminFinanceRefundDisburseModal } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDisburseModal';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      TITLE: 'Flag Cash Discrepancy',
      DESCRIPTION: 'Identify and flag cash discrepancy',
      REASON_LABEL: 'Discrepancy Reason',
      NOTES_LABEL: 'Audit Notes',
      NOTES_PLACEHOLDER: 'Enter audit notes...',
      CANCEL: 'Cancel',
      SUBMIT: 'Flag Discrepancy',
      'REASONS.CASH_SHORTAGE': 'Cash Drawer Shortage',
      'REASONS.MISSING_SLIP': 'Missing Bank Deposit Slip',
      'REASONS.UNAUTHORIZED_EXPENSE': 'Unauthorized Petty Expense',
      'REASONS.RECORD_MISMATCH': 'Digital Register Mismatch',
    };
    return map[key] ?? key;
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('भाग 3: Incomplete / Adhure Flows Verification', () => {
  describe('Flow 1: Daily Settlement Cash Discrepancy Resolution', () => {
    const mockSettlement: DailySettlementRecord = {
      id: 'SETTLE-101',
      date: '2026-11-18',
      branchId: 'BR-001',
      branchName: 'Downtown Central',
      shiftName: 'Morning Shift',
      managerId: 'MGR-01',
      managerName: 'Rahul Sharma',
      openingCash: 50000,
      cashCollected: 300000,
      upiCollected: 500000,
      expensesPaid: 20000,
      expectedClosingCash: 330000,
      actualHandoverCash: 280000,
      difference: -50000, // ₹500 shortage
      status: 'PENDING_APPROVAL',
      createdAt: '2026-11-18T14:00:00Z',
    };

    it('allows admin to choose between salary deduction, carry-forward, on-spot deposit, or loss write-off', async () => {
      const onConfirm = vi.fn().mockResolvedValue(true);
      const onClose = vi.fn();

      render(
        <AdminAccountsDailySettlementDiscrepancyModal
          record={mockSettlement}
          isOpen={true}
          isSubmitting={false}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      );

      // Verify the modal rendered the options
      expect(screen.getByText('Deduct from Salary')).toBeDefined();
      expect(screen.getByText('Carry-Forward Deficit')).toBeDefined();
      expect(screen.getByText('Immediate Deposit')).toBeDefined();
      expect(screen.getByText('Waive / Loss Absorption')).toBeDefined();

      // Choose Carry-Forward
      const carryForwardRadio = screen.getByLabelText(/Carry-Forward Deficit/i);
      fireEvent.click(carryForwardRadio);

      // Fill required notes
      const notesInput = screen.getByPlaceholderText('Enter audit notes...');
      fireEvent.change(notesInput, { target: { value: 'Manager Rahul Sharma will cover shortage in morning handover' } });

      // Submit
      const submitBtn = screen.getByRole('button', { name: /flag discrepancy/i });
      fireEvent.click(submitBtn);

      expect(onConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          settlementId: 'SETTLE-101',
          resolutionAction: 'CARRY_FORWARD',
          adminNotes: 'Manager Rahul Sharma will cover shortage in morning handover',
        })
      );
    });

    it('submits salary deduction strategy when selected', async () => {
      const onConfirm = vi.fn().mockResolvedValue(true);
      const onClose = vi.fn();

      render(
        <AdminAccountsDailySettlementDiscrepancyModal
          record={mockSettlement}
          isOpen={true}
          isSubmitting={false}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      );

      // Default is DEDUCT_SALARY
      const notesInput = screen.getByPlaceholderText('Enter audit notes...');
      fireEvent.change(notesInput, { target: { value: 'Shortage of ₹500 deducted from November salary' } });

      const submitBtn = screen.getByRole('button', { name: /flag discrepancy/i });
      fireEvent.click(submitBtn);

      expect(onConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          settlementId: 'SETTLE-101',
          resolutionAction: 'DEDUCT_SALARY',
        })
      );
    });
  });

  describe('Flow 2: Referral Bonus Flow (Fee Deduction vs Cash/UPI Payout Voucher)', () => {
    const mockReferrer: AdminFinanceDemoReferrer = {
      id: 101,
      name: 'Aditya Verma',
      smartId: 'SL-2026-081',
      referredNames: ['Pooja Sharma', 'Kunal Shah', 'Vikas Mehra'],
      bonusEarned: 150000, // ₹1,500
      redeemed: 100000,    // ₹1,000
      balance: 50000,      // ₹500
      branch: 'Downtown Central',
    };

    it('allows redeeming bonus by adjusting into next month fee with Credit Note', () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminFinanceReferralsRedeemModal
          referrer={mockReferrer}
          isOpen={true}
          onClose={onClose}
          onConfirmRedeem={onConfirm}
        />
      );

      expect(screen.getByText(/Adjust in Next Fee/i)).toBeDefined();
      expect(screen.getByText(/Generated Invoice Credit Note:/i)).toBeDefined();

      const submitBtn = screen.getByTestId('admin-confirm-referral-disbursement-btn');
      fireEvent.click(submitBtn);

      expect(onConfirm).toHaveBeenCalledWith(
        101,
        50000,
        'fee_adjustment',
        expect.any(String),
        expect.objectContaining({
          invoiceCreditNote: expect.stringContaining('CR-REF-'),
        })
      );
    });

    it('allows redeeming bonus via Cash/UPI with Transaction UTR input and printable voucher', () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminFinanceReferralsRedeemModal
          referrer={mockReferrer}
          isOpen={true}
          onClose={onClose}
          onConfirmRedeem={onConfirm}
        />
      );

      // Switch to Cash/UPI
      const cashUpiBtn = screen.getByText(/Disburse Cash \/ UPI/i);
      fireEvent.click(cashUpiBtn);

      // UTR input should appear
      const utrInput = screen.getByPlaceholderText(/412398512401/i);
      expect(utrInput).toBeDefined();

      fireEvent.change(utrInput, { target: { value: '419900228811' } });

      const submitBtn = screen.getByTestId('admin-confirm-referral-disbursement-btn');
      fireEvent.click(submitBtn);

      expect(onConfirm).toHaveBeenCalledWith(
        101,
        50000,
        'cash_upi',
        expect.any(String),
        expect.objectContaining({
          subChannel: 'UPI Transfer',
          utrReference: '419900228811',
        })
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
        />
      );

      expect(screen.getByText('PV-REF-2026-9041')).toBeDefined();
      expect(screen.getByText('Aditya Verma')).toBeDefined();
      expect(screen.getByText('419900228811')).toBeDefined();
      expect(screen.getByTestId('admin-print-referral-voucher-btn')).toBeDefined();
    });
  });

  describe('Flow 3: Refund Approval Flow (Transaction UTR Entry & Receipt Generation)', () => {
    const mockApprovedRefund: AdminFinanceRefund = {
      id: 'REF-7801',
      studentName: 'Kunal Singhal',
      smartId: 'SL-2026-092',
      depositHeld: 2000,
      deductionAmount: 500,
      netRefund: 1500,
      status: 'approved',
      paymentMethod: 'UPI',
      branchName: 'Downtown Central',
    };

    it('opens disburse modal, accepts Transaction UTR and generates refund receipt', () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      render(
        <AdminFinanceRefundDisburseModal
          refund={mockApprovedRefund}
          isOpen={true}
          onClose={onClose}
          onConfirmDisburse={onConfirm}
        />
      );

      expect(screen.getByText('Record Refund Transfer')).toBeDefined();
      expect(screen.getByText('₹1,500.00')).toBeDefined();

      const utrInput = screen.getByLabelText(/Transaction UTR/i);
      fireEvent.change(utrInput, { target: { value: '410982349120' } });

      const submitBtn = screen.getByTestId('admin-confirm-refund-transfer-btn');
      fireEvent.click(submitBtn);

      expect(onConfirm).toHaveBeenCalledWith(
        'REF-7801',
        expect.objectContaining({
          transactionUtr: '410982349120',
          paymentMethod: 'UPI Transfer',
          receiptNumber: expect.stringContaining('RCT-REF-'),
        })
      );
    });
  });
});
