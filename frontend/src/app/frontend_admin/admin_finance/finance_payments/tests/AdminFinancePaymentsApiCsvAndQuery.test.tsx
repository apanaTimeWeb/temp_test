import { afterEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { mswTestServer } from "@/app/frontend_admin/test/mswServer";
import { fetchAdminFinancePayments } from "@/app/frontend_admin/admin_finance/finance_payments/api/admin_finance_payments_api";
import { ADMIN_FINANCE_PAYMENTS_MSW_HANDLERS } from "@/app/frontend_admin/admin_finance/finance_payments/mocks/AdminFinancePaymentsMSWHandlers";
import { ADMIN_FINANCE_PAYMENTS_API } from "@/app/frontend_admin/admin_finance/finance_payments/config/admin_finance_payments.url_config";
import { formatAdminFinanceApiAmount, formatCurrency, majorToMinor, minorToMajor, formatDate } from "@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat";
import { buildAdminFinancePaymentsCsv } from "@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsCsvUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import useQueryHook from "@/app/frontend_admin/admin_finance/finance_payments/hooks/useAdminFinancePaymentsQuery";


// Preserved assertions from AdminFinancePaymentsApi.test.ts.
describe('AdminFinancePaymentsApi.test.ts preserved assertions', () => {
describe('admin_finance_payments API contract', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('accepts synthetic payment records matching the local response schema', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
    mswTestServer.use(...ADMIN_FINANCE_PAYMENTS_MSW_HANDLERS);
    const payments = await fetchAdminFinancePayments();
    expect(payments).toHaveLength(4);
    expect(new Set(payments.map((payment) => payment.mode))).toEqual(new Set(['cash', 'upi', 'card', 'bank']));
    expect(payments.every((payment) => String(payment.id).startsWith('synthetic-'))).toBe(true);
  });

  it('rejects a malformed payment response', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
     mswTestServer.use(http.get(ADMIN_FINANCE_PAYMENTS_API.LIST, () => HttpResponse.json({ success: true, message: 'Malformed test response.', data: { records: [] }, requestId: 'test-finance-payments-malformed' })));
    await expect(fetchAdminFinancePayments()).rejects.toThrow();
  });
});
});

describe('AdminFinancePaymentsApiAmountFormat.test.ts preserved assertions', () => {
describe('formatAdminFinanceApiAmount', () => {
  it('formats only when currency and unit are explicit', () => {
    expect(formatAdminFinanceApiAmount(123456, 'INR', 'minor')).toContain('1,234.56');
    expect(formatAdminFinanceApiAmount(1234.5, 'USD', 'major')).toContain('1,234.50');
  });
  it('does not silently assume currency or amount scale', () => {
    expect(formatAdminFinanceApiAmount(123456, undefined, 'minor')).toBe('—');
    expect(formatAdminFinanceApiAmount(123456, 'INR', undefined)).toBe('—');
    expect(formatAdminFinanceApiAmount(Number.NaN, 'INR', 'minor')).toBe('—');
    expect(formatAdminFinanceApiAmount(1.5, 'INR', 'minor')).toBe('—');
  });
});
});


// Preserved assertions from AdminFinancePaymentsCsvUtils.test.ts.
describe('AdminFinancePaymentsCsvUtils.test.ts preserved assertions', () => {
describe('Admin Finance payments CSV', () => {
  it('preserves explicit currency/unit metadata and neutralizes formulas in user-controlled text', () => {
    const csv = buildAdminFinancePaymentsCsv([{
      receiptNumber: 'REC-1', date: '2026-10-13', studentName: '=HYPERLINK("x")', smartId: 'S-01',
      amount: 12550, currencyCode: 'INR', amountUnit: 'minor', mode: 'upi', lateFee: 50, receivedBy: '+malicious', status: 'valid',
    }], { receipt: 'Receipt', date: 'Date', student: 'Student', smartId: 'Smart ID', amount: 'Amount', currency: 'Currency', amountUnit: 'Amount Unit', mode: 'Mode', lateFee: 'Late Fee', receivedBy: 'Received By', status: 'Status' });
    expect(csv).toContain('"Currency"');
    expect(csv).toContain('"Amount Unit"');
    expect(csv).toContain('"INR"');
    expect(csv).toContain('"minor"');
    expect(csv).toContain('"12550"');
    expect(csv).toContain("'=HYPERLINK(");
    expect(csv).toContain("'+malicious");
    expect(csv.split('\r\n')).toHaveLength(2);
  });

  it('localizes all CSV headers when labels are supplied', () => {
    const csv = buildAdminFinancePaymentsCsv([], { receipt: 'Beleg', date: 'Datum', student: 'Lernende', smartId: 'ID', amount: 'Betrag', currency: 'Währung', amountUnit: 'Einheit', mode: 'Zahlungsart', lateFee: 'Gebühr', receivedBy: 'Erhalten von', status: 'Status' });
    const header = csv.split('\r\n')[0];
    expect(header).toContain('"Beleg"');
    expect(header).toContain('"Datum"');
    expect(header).toContain('"Zahlungsart"');
    expect(header).toContain('"Erhalten von"');
  });

});
});

describe('AdminFinancePaymentsCurrencySubunit.test.ts preserved assertions', () => {
describe('currency subunit formatting', () => {
  it('uses the currency’s actual fraction digits rather than assuming two decimals', () => {
    expect(minorToMajor(1234, 'JPY', 'ja-JP')).toBe(1234);
    expect(majorToMinor(1234, 'JPY', 'ja-JP')).toBe(1234);
    expect(formatCurrency(1234, 'JPY', 'ja-JP')).not.toMatch(/\.00/);
  });

  it('preserves three-decimal minor units for currencies such as BHD', () => {
    expect(minorToMajor(1234, 'BHD', 'en-BH')).toBe(1.234);
    expect(majorToMinor(1.234, 'BHD', 'en-BH')).toBe(1234);
    expect(formatCurrency(1234, 'BHD', 'en-BH')).toContain('1.234');
  });
});


describe('finance minor-unit guards', () => {
  it('rejects negative, fractional and unsafe monetary values', () => {
    expect(() => formatCurrency(-1, 'INR', 'en-IN')).toThrow(RangeError);
    expect(() => formatCurrency(1.5, 'INR', 'en-IN')).toThrow(RangeError);
    expect(() => minorToMajor(Number.MAX_SAFE_INTEGER + 1, 'INR', 'en-IN')).toThrow(RangeError);
    expect(() => majorToMinor(-0.5, 'INR', 'en-IN')).toThrow(RangeError);
  });
});
});


// Preserved assertions from useAdminFinancePaymentsQuery.test.tsx.
const { fetchAdminFinancePaymentsMock } = vi.hoisted(() => ({ fetchAdminFinancePaymentsMock: vi.fn() }));
vi.mock('@/app/frontend_admin/admin_finance/finance_payments/api/admin_finance_payments_api', () => ({ fetchAdminFinancePayments: fetchAdminFinancePaymentsMock }));

describe('useAdminFinancePaymentsQuery.test.tsx preserved assertions', () => {
function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { client, wrapper };
}

afterEach(() => {
  fetchAdminFinancePaymentsMock.mockReset();
});

describe('useAdminFinancePaymentsQuery', () => {
  it('loads list data through the module API adapter', async () => {
    fetchAdminFinancePaymentsMock.mockResolvedValue([]);
    const { client, wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useQueryHook(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
    expect(fetchAdminFinancePaymentsMock).toHaveBeenCalledTimes(1);

    unmount();
    client.clear();
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
