import { afterEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { mswTestServer } from "@/app/frontend_admin/test/mswServer";
import { fetchAdminFinanceRefunds } from "@/app/frontend_admin/admin_finance/finance_refunds/api/admin_finance_refunds_api";
import { ADMIN_FINANCE_REFUNDS_MSW_HANDLERS } from "@/app/frontend_admin/admin_finance/finance_refunds/mocks/AdminFinanceRefundsMSWHandlers";
import { ADMIN_FINANCE_REFUNDS_API } from "@/app/frontend_admin/admin_finance/finance_refunds/config/admin_finance_refunds.url_config";
import { formatAdminFinanceApiAmount, formatDate } from "@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat";
import { getAdminFinanceRefundStatusLabelKey } from "@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsRefundStatus";
import { render, screen, renderHook, waitFor } from "@testing-library/react";
import en from "@/app/frontend_admin/admin_finance/finance_refunds/locales/admin_finance_refunds_en.json";
import hi from "@/app/frontend_admin/admin_finance/finance_refunds/locales/admin_finance_refunds_hi.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import useQueryHook from "@/app/frontend_admin/admin_finance/finance_refunds/hooks/useAdminFinanceRefundsQuery";


// Preserved assertions from AdminFinanceRefundsApi.test.ts.
describe('AdminFinanceRefundsApi.test.ts preserved assertions', () => {
describe('admin_finance_refunds API contract', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('accepts synthetic refund records matching the local response schema', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
    mswTestServer.use(...ADMIN_FINANCE_REFUNDS_MSW_HANDLERS);
    const refunds = await fetchAdminFinanceRefunds();
    expect(refunds).toHaveLength(4);
    expect(refunds.map((refund) => refund.status)).toEqual(['pending', 'approved', 'processed', 'rejected']);
    expect(refunds.every((refund) => String(refund.id).startsWith('synthetic-'))).toBe(true);
  });

  it('rejects a malformed refund response', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
     mswTestServer.use(http.get(ADMIN_FINANCE_REFUNDS_API.LIST, () => HttpResponse.json({ success: true, message: 'Malformed test response.', data: { records: [] }, requestId: 'test-finance-refunds-malformed' })));
    await expect(fetchAdminFinanceRefunds()).rejects.toThrow();
  });
});
});

describe('AdminFinanceRefundsApiAmountFormat.test.ts preserved assertions', () => {
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


// Preserved assertions from AdminFinanceRefundsRefundStatusLocalization.test.tsx.
describe('AdminFinanceRefundsRefundStatusLocalization.test.tsx preserved assertions', () => {
describe('production refund status localization mapping', () => {
  it('maps canonical statuses to keys present in English and Hindi catalogs', () => {
    const labels = (catalog: typeof en) => catalog.ADMIN_FINANCE_LEDGER_PAGES;
    for (const status of ['pending', 'approved', 'processed', 'rejected']) {
      const key = getAdminFinanceRefundStatusLabelKey(status);
      expect(Object.prototype.hasOwnProperty.call(labels(en), key)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(labels(hi), key)).toBe(true);
    }
  });
  it('uses a safe fallback for unknown statuses', () => {
    expect(getAdminFinanceRefundStatusLabelKey('unexpected')).toBe('STATUS');
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

function createAdminFinanceRefundsTestWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  return { queryClient, wrapper };
}

describe('useAdminFinanceRefundsQuery', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('loads list data through the module API adapter', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
    mswTestServer.use(...ADMIN_FINANCE_REFUNDS_MSW_HANDLERS);
    const { queryClient, wrapper } = createAdminFinanceRefundsTestWrapper();
    const { result, unmount } = renderHook(() => useQueryHook(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(4);
    expect(result.current.data?.map((refund) => refund.status)).toEqual(['pending', 'approved', 'processed', 'rejected']);

    unmount();
    queryClient.clear();
    vi.unstubAllEnvs();
  });
});
