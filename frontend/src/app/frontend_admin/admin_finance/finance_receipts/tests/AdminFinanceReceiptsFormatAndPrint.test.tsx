import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate, getAdminFinanceLocalDateString, getAdminFinanceLocalMonthString } from "@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsFormat";
import { AdminFinanceThermalPrint } from "@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsThermalPrint";
import { openAdminFinanceWhatsApp } from "@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsWhatsApp";

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/app/frontend_admin/admin_finance/finance_receipts/locales/admin_finance_receipts_en.json';
import { AdminFinanceReceiptsIdPage } from '@/app/frontend_admin/admin_finance/finance_receipts/components/AdminFinanceReceiptsIdPage';
import { ADMIN_FINANCE_RECEIPTS_ROUTES } from '@/app/frontend_admin/admin_finance/finance_receipts/config/admin_finance_receipts.url_config';
const { pushSpy } = vi.hoisted(() => ({ pushSpy: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushSpy }), useParams: () => ({ id: 'unused' }) }));

// Preserved assertions from AdminFinanceReceiptsFormatDate.test.ts.
describe('AdminFinanceReceiptsFormatDate.test.ts preserved assertions', () => {
describe('Admin Finance date-only handling', () => {
  const originalDocumentLanguage = document.documentElement.lang;
  afterEach(() => { document.documentElement.lang = originalDocumentLanguage; });

  it('formats local dates and months without UTC date rollover', () => {
    const date = new Date(2026, 9, 13, 0, 15);
    expect(getAdminFinanceLocalDateString(date)).toBe('2026-10-13');
    expect(getAdminFinanceLocalMonthString(date)).toBe('2026-10');
  });

  it('treats a date-only value as a calendar date, not a UTC instant', () => {
    document.documentElement.lang = 'en-GB';
    expect(formatDate('2026-04-11')).toBe('11 Apr 2026');
  });
});
});

describe('AdminFinanceReceiptsStandaloneContract.test.ts preserved assertions', () => {
// Responsibility: inspect the actual module-owned standalone host contract, not a naming-only placeholder.
describe('admin finance receipts standalone contract', () => {
  it('declares the required minimal host module contracts', () => {
    const stubs = readFileSync(path.resolve(__dirname, '../contracts/host-stubs.d.ts'), 'utf8');
    expect(stubs).toContain("declare module '@/lib/api'");
    expect(stubs).toContain("declare module '@/lib/display_value'");
    expect(stubs).toContain("declare module '@/components/ui/*'");
  });
});
});


// Preserved assertions from AdminFinanceReceiptsThermalPrint.test.ts.
describe('AdminFinanceReceiptsThermalPrint.test.ts preserved assertions', () => {
describe('Admin Finance thermal print', () => {
  afterEach(() => vi.restoreAllMocks());

  it('formats monetary values from paise and escapes printable user text', () => {
    const documentMock = { write: vi.fn(), close: vi.fn() };
    const printWindow = { opener: window, document: documentMock } as unknown as Window;
    vi.spyOn(window, 'open').mockReturnValue(printWindow);

    AdminFinanceThermalPrint({
      type: 'receipt', shopName: 'Gym <Demo>', branch: 'Main Branch', studentName: 'Asha', smartId: 'S-01', phone: '9000000000',
      shift: 'Morning', seat: 'A-01', plan: 'Monthly', billNumber: 'REC-1', date: '2026-10-13',
      totalPayable: 12550, amountPaid: 10000, discount: 500, balance: 2550, paymentMode: 'UPI',
      labels: { bill: 'Bill', date: 'Date', student: 'Student', smartId: 'Smart ID', phone: 'Phone', shift: 'Shift', seat: 'Seat', plan: 'Plan', payment: 'Payment', transaction: 'Transaction', total: 'Total', paid: 'Paid', discount: 'Discount', balance: 'Balance' },
    });

    const html = String(documentMock.write.mock.calls[0]?.[0] ?? '');
    expect(html).toContain('Gym &lt;Demo&gt;');
    expect(html).toContain('₹125.50');
    expect(html).toContain('₹100.00');
    expect(html).toContain('₹5.00');
    expect(html).toContain('₹25.50');
  });

  it('surfaces a blocked popup instead of pretending printing succeeded', () => {
    vi.spyOn(window, 'open').mockReturnValue(null);
    expect(() => AdminFinanceThermalPrint({
      type: 'receipt', shopName: 'Gym', branch: 'Main', studentName: 'Asha', smartId: 'S-01', phone: '9000000000',
      shift: 'Morning', seat: 'A-01', plan: 'Monthly', billNumber: 'REC-1', date: '2026-10-13',
      totalPayable: 100, amountPaid: 100, discount: 0, balance: 0, paymentMode: 'UPI',
      labels: { bill: 'Bill', date: 'Date', student: 'Student', smartId: 'Smart ID', phone: 'Phone', shift: 'Shift', seat: 'Seat', plan: 'Plan', payment: 'Payment', transaction: 'Transaction', total: 'Total', paid: 'Paid', discount: 'Discount', balance: 'Balance' },
    })).toThrow(/Printing was blocked/);
  });
});
});

describe('AdminFinanceReceiptsWhatsApp.test.ts preserved assertions', () => {
afterEach(() => {
  vi.restoreAllMocks();
});

describe('openAdminFinanceWhatsApp', () => {
  it('normalizes the phone number and URL-encodes the message', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    expect(() => openAdminFinanceWhatsApp('+91 (98765) 43210', 'Fee reminder & invoice #A-10')).toThrow(/blocked/);

    expect(openSpy).toHaveBeenCalledWith(
      'https://wa.me/%2B919876543210?text=Fee%20reminder%20%26%20invoice%20%23A-10',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
});


describe('date-fns locale-aware finance date formatting', () => {
  const originalDocumentLanguage = document.documentElement.lang;
  afterEach(() => { document.documentElement.lang = originalDocumentLanguage; });
  it('formats a date-only value with the active HTML language and rejects impossible dates', () => {
    document.documentElement.lang = 'en-GB';
    expect(formatDate('2026-04-11')).toBe('11 Apr 2026');
    document.documentElement.lang = 'en-US';
    expect(formatDate('2026-04-11')).toBe('Apr 11, 2026');
    expect(formatDate('2026-02-30')).toBe('');
  });
});

// Exercises the existing query-driven detail path for every list-backed demo record; no server contract is inferred.
describe('source-backed receipt detail route IDs', () => {
  afterEach(() => { cleanup(); vi.unstubAllEnvs(); pushSpy.mockReset(); });

  it.each([
    ['SL360-TRX-99421-X', 'REC-20260411-001', 'Aravind Sharma'],
    ['SL360-TRX-88310-Y', 'REC-20260410-002', 'Gajodhar Prasad'],
    ['SL360-TRX-77203-Z', 'REC-20260409-003', 'Sara Mishra'],
    ['SL360-TRX-66192-A', 'REC-20260408-004', 'Rohan Khanna'],
    ['SL360-TRX-55081-B', 'REC-20260407-005', 'Priya Nair']
  ])('renders known receipt ID %s from the list fixtures', (routeId, expectedNumber, expectedStudent) => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={messages}>
      <AdminFinanceReceiptsIdPage routeId={routeId} />
    </NextIntlClientProvider>);
    expect(screen.getByText(new RegExp(expectedNumber))).toBeTruthy();
    expect(screen.getByText(expectedStudent)).toBeTruthy();
  });

  it('renders a localized not-found view and returns to the canonical list route', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={messages}>
      <AdminFinanceReceiptsIdPage routeId="unknown-receipt-id" />
    </NextIntlClientProvider>);
    expect(screen.getByRole('heading', { name: messages.ADMIN_FINANCE_RECEIPTS_DETAIL.NOT_FOUND_TITLE })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: messages.ADMIN_FINANCE_RECEIPTS_DETAIL.BACK }));
    expect(pushSpy).toHaveBeenCalledWith(ADMIN_FINANCE_RECEIPTS_ROUTES.ROOT);
  });
});
