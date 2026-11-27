import { AdminAccountsFinancialReportsPage } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsPage';
import financialReportsMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/locales/admin_accounts_financial_reports_en.json';
import {
  ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
  ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/mocks/AdminAccountsFinancialReportsFixtures';
import {
  buildFinancialReportPdfBlob,
  exportFinancialReportCsv,
  exportFinancialReportExcel,
  printFinancialReport,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsExporter';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/admin/admin_accounts_assets/accounts_financial_reports',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider', () => ({
  useAdminBranch: () => ({
    selectedBranchId: 'ALL',
    selectedBranch: null,
    isAllBranches: true,
    availableBranches: [
      { id: 'branch-1', name: 'Downtown Central' },
      { id: 'branch-2', name: 'Westside Hub' },
    ],
  }),
}));

vi.mock('@/lib/runtimeFeatures', () => ({
  isFrontendDemoModeEnabled: () => true,
}));

vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mock-apexchart">Chart</div>,
}));

describe('Admin Accounts Financial Reports Controls', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Custom Date Picker button and inputs on Financial Reports page', () => {
    render(
      <NextIntlClientProvider locale="en" messages={financialReportsMessages}>
        <AdminAccountsFinancialReportsPage />
      </NextIntlClientProvider>,
    );

    const customBtn = screen.getByRole('button', { name: /Custom Range/i });
    expect(customBtn).toBeInTheDocument();

    fireEvent.click(customBtn);
    expect(customBtn).toHaveAttribute('aria-pressed', 'true');

    const startInput = screen.getByLabelText('Report start date');
    const endInput = screen.getByLabelText('Report end date');
    expect(startInput).toBeInTheDocument();
    expect(endInput).toBeInTheDocument();

    fireEvent.change(startInput, { target: { value: '2026-09-01' } });
    expect(startInput).toHaveValue('2026-09-01');

    expect(screen.getByTitle('Print A4 Financial Statement Report')).toBeInTheDocument();
    expect(screen.getByTitle('Export P&L Report as CSV')).toBeInTheDocument();
    expect(screen.getByTitle('Export P&L Report as Formatted Excel (.xls)')).toBeInTheDocument();
    expect(screen.getByTitle('Download Financial Audit Statement as PDF')).toBeInTheDocument();
  });

  it('builds standard %PDF-1.4 financial statement Blob', async () => {
    const blob = buildFinancialReportPdfBlob({
      period: 'monthly',
      rows: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES,
      categories: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
      totalIncomeMinor: 33900000,
      totalExpenseMinor: 13600000,
    });

    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(500);

    const buf = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
    const text = new TextDecoder().decode(buf);
    expect(text.startsWith('%PDF-1.4')).toBe(true);
    expect(text).toContain('SMART LIBRARY FINANCIAL STATEMENT & AUDIT');
    expect(text).toContain('%%EOF');
  });

  it('exports financial report CSV and Excel files', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();

    const spec = {
      period: 'quarterly',
      rows: [{ month: 'Oct-Dec', incomeMinor: 13100000, expenseMinor: 5500000 }],
      categories: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
      totalIncomeMinor: 13100000,
      totalExpenseMinor: 5500000,
    };

    exportFinancialReportCsv(spec);
    expect(clickSpy).toHaveBeenCalledTimes(1);

    exportFinancialReportExcel(spec);
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('prints A4 styled financial statement report', () => {
    const writeMock = vi.fn();
    const closeMock = vi.fn();
    const mockWindow = {
      document: {
        write: writeMock,
        close: closeMock,
      },
    };
    vi.spyOn(window, 'open').mockReturnValue(mockWindow as unknown as Window);

    printFinancialReport({
      period: 'yearly',
      rows: [{ month: 'Period Total', incomeMinor: 33900000, expenseMinor: 13600000 }],
      categories: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
      totalIncomeMinor: 33900000,
      totalExpenseMinor: 13600000,
    });

    expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=900,height=800');
    expect(writeMock).toHaveBeenCalled();
    const htmlWritten = writeMock.mock.calls[0]?.[0];
    expect(htmlWritten).toContain('Official Executive Financial Statement & P&L Audit');
    expect(htmlWritten).toContain('Chief Accounts Officer');
    expect(closeMock).toHaveBeenCalled();
  });
});
