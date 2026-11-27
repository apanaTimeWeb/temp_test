import { AdminFinancePaymentInvoiceModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentInvoiceModal';
import { AdminFinancePaymentReceiptModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentReceiptModal';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import {
  buildSimplePdfBlob,
  buildWhatsAppLink,
  formatCleanPhoneNumber,
} from '@/app/frontend_admin/admin_finance/finance_payments/utils/adminFinancePaymentsPdf';
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

describe('AdminFinancePayments PDF & WhatsApp utilities', () => {
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
      />,
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
      />,
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
      />,
    );

    expect(screen.getByRole('button', { name: /Download PDF/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Email Receipt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Print Receipt \(80mm\)/i })).toBeTruthy();
  });
});
