import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  buildSimplePdfBlob,
  formatCleanPhoneNumber,
  buildWhatsAppLink,
  downloadPaymentInvoicePdf,
  downloadPaymentReceiptPdf,
  downloadRefundVoucherPdf,
} from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import { AdminFinancePaymentInvoiceModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentInvoiceModal';
import { AdminFinancePaymentReceiptModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentReceiptModal';
import { AdminFinanceRefundDetailModal } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDetailModal';
import { AdminFinanceReferralsRedeemModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsRedeemModal';
import { AdminFinanceReferralsTable } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTable';
import { AdminFinanceRefundsTable } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTable';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AdminFinancePdfGenerator & WhatsApp utilities', () => {
  it('generates a valid %PDF-1.4 Blob', async () => {
    const blob = buildSimplePdfBlob({
      title: 'TEST TITLE',
      subtitle: 'Test Subtitle',
      meta: [{ label: 'Field 1', value: 'Value 1' }],
      items: [{ desc: 'Item 1', amount: 'INR 1,000' }],
      totals: { label: 'TOTAL', value: 'INR 1,000' },
      footer: 'Test Footer',
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(100);

    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
    const text = new TextDecoder().decode(arrayBuffer);
    expect(text.startsWith('%PDF-1.4')).toBe(true);
    expect(text.includes('TEST TITLE')).toBe(true);
    expect(text.includes('%%EOF')).toBe(true);
  });

  it('cleans 10-digit Indian phone numbers to 91XXXXXXXXXX', () => {
    expect(formatCleanPhoneNumber('9876543210')).toBe('919876543210');
    expect(formatCleanPhoneNumber('+91 98765-43210')).toBe('919876543210');
    expect(formatCleanPhoneNumber('09876543210')).toBe('09876543210');
    expect(formatCleanPhoneNumber('')).toBe('');
    expect(formatCleanPhoneNumber(undefined)).toBe('');
  });

  it('constructs WhatsApp URL with pre-filled phone number and message', () => {
    const url = buildWhatsAppLink('9876543210', 'Hello Aarav');
    expect(url).toContain('https://wa.me/919876543210?text=Hello%20Aarav');

    const urlNoPhone = buildWhatsAppLink(undefined, 'Generic Msg');
    expect(urlNoPhone).toBe('https://wa.me/?text=Generic%20Msg');
  });
});

describe('AdminFinancePaymentInvoiceModal Controls', () => {
  const mockPayment: AdminFinancePayment = {
    id: 'pay-001',
    receiptNumber: 'REC-2026-1042',
    date: '2026-04-14',
    studentName: 'Aarav Sharma',
    smartId: 'SL-DT-1001',
    studentPhone: '9876543210',
    studentEmail: 'aarav.sharma@example.com',
    amount: 6500,
    currencyCode: 'INR',
    amountUnit: 'major',
    mode: 'upi',
    txnId: 'UPI948201849102',
    receivedBy: 'Rohan Sharma',
    status: 'valid',
    branch: 'Downtown Central',
  };

  it('renders Direct PDF Download, Email Receipt, and WhatsApp share buttons', () => {
    render(
      <AdminFinancePaymentInvoiceModal
        payment={mockPayment}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Download PDF/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Email Receipt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Share WhatsApp/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Print Tax Invoice/i })).toBeTruthy();
  });

  it('triggers WhatsApp with student phone prefilled when clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <AdminFinancePaymentInvoiceModal
        payment={mockPayment}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const waBtn = screen.getByRole('button', { name: /Share WhatsApp/i });
    fireEvent.click(waBtn);

    expect(openSpy).toHaveBeenCalled();
    const calledUrl = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain('https://wa.me/919876543210');

    openSpy.mockRestore();
  });
});

describe('AdminFinancePaymentReceiptModal Controls', () => {
  const mockPayment: AdminFinancePayment = {
    id: 'pay-001',
    receiptNumber: 'REC-2026-1042',
    date: '2026-04-14',
    studentName: 'Aarav Sharma',
    smartId: 'SL-DT-1001',
    studentPhone: '9876543210',
    amount: 6500,
    currencyCode: 'INR',
    amountUnit: 'major',
    mode: 'upi',
    receivedBy: 'Rohan Sharma',
    status: 'valid',
  };

  it('renders Download PDF, Email Receipt, and WhatsApp buttons', () => {
    render(
      <AdminFinancePaymentReceiptModal
        payment={mockPayment}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Download PDF/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Email Receipt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Print Receipt \(80mm\)/i })).toBeTruthy();
  });
});

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
      />
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
      />
    );

    expect(screen.getByLabelText(/Download refund voucher for Aditi Rao/i)).toBeTruthy();
    expect(screen.getByLabelText(/Send notification to Aditi Rao/i)).toBeTruthy();
  });
});

describe('AdminFinanceReferrals Controls & Redeem Modal', () => {
  const mockReferrer: AdminFinanceDemoReferrer = {
    id: 1,
    name: 'Rahul Kumar',
    smartId: 'STU101',
    referredNames: ['Priya S', 'Aman V'],
    bonusEarned: 50000, // ₹500
    redeemed: 30000,    // ₹300
    balance: 20000,     // ₹200
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
      />
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
      />
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
      />
    );

    expect(screen.getByText(/Disburse Referral Bonus/i)).toBeTruthy();
    expect(screen.getByText(/Adjust in Next Fee/i)).toBeTruthy();
    expect(screen.getByText(/Disburse Cash \/ UPI/i)).toBeTruthy();

    const submitBtn = screen.getByRole('button', { name: /Confirm Disbursement/i });
    fireEvent.click(submitBtn);

    expect(handleConfirm).toHaveBeenCalledWith(1, 20000, 'fee_adjustment', expect.any(String));
  });
});
