import { AdminFinanceRefundDetailModal } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDetailModal';
import { AdminFinanceRefundDisburseModal } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDisburseModal';
import { AdminFinanceRefundsTable } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTable';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
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

describe('AdminFinanceRefundDetailModal & Table Controls', () => {
  const mockRefund: AdminFinanceRefund = {
    id: 'ref-001',
    studentName: 'Aditi Rao',
    smartId: 'SL-DT-1002',
    studentPhone: '9876543220',
    exitDate: '2026-04-12',
    depositHeld: 2500,
    deductionAmount: 500,
    netRefund: 2000,
    status: 'approved',
    branchName: 'Downtown Central',
    paymentMethod: 'UPI (GPay)',
  };

  it('renders Notify Student and Download PDF in Refund Detail Modal', () => {
    render(
      <AdminFinanceRefundDetailModal
        refund={mockRefund}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /Notify Student/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Download PDF/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Print Voucher/i })).toBeTruthy();
  });

  it('renders voucher download and WhatsApp notify action triggers in Refunds table', () => {
    render(
      <AdminFinanceRefundsTable
        refunds={[mockRefund]}
        isPending={false}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        onViewDetail={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/Download refund voucher for Aditi Rao/i)).toBeTruthy();
    expect(screen.getByLabelText(/Send notification to Aditi Rao/i)).toBeTruthy();
  });

  it('opens disburse modal, accepts Transaction UTR and generates refund receipt', () => {
    const approvedRefund: AdminFinanceRefund = {
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
    const onConfirm = vi.fn();

    render(
      <AdminFinanceRefundDisburseModal
        refund={approvedRefund}
        isOpen={true}
        onClose={vi.fn()}
        onConfirmDisburse={onConfirm}
      />,
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
      }),
    );
  });
});
