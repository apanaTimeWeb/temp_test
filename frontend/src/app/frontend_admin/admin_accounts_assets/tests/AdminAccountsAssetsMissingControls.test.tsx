import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

// Daily settlement imports
import { AdminAccountsDailySettlementPage } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementPage';
import { printDailySettlementVoucher } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTableRow';
import { ADMIN_DAILY_SETTLEMENT_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/mocks/fixtures/admin_accounts_daily_settlement.fixtures';
import dailySettlementMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/locales/admin_accounts_daily_settlement_en.json';

// Expenses imports
import { AdminAccountsExpensesHeaderSection } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesHeaderSection';
import { AdminAccountsExpensesFilterSection } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesFilterSection';
import expensesMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/locales/admin_accounts_expenses_en.json';

// Financial Reports imports
import { AdminAccountsFinancialReportsPage } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsPage';
import {
  buildFinancialReportPdfBlob,
  exportFinancialReportCsv,
  exportFinancialReportExcel,
  printFinancialReport,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsExporter';
import {
  ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES,
  ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/mocks/AdminAccountsFinancialReportsFixtures';
import financialReportsMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/locales/admin_accounts_financial_reports_en.json';

// Assets register imports
import { AdminAssetsRegisterPage } from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterPage';
import assetsMessages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_en.json';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/admin/accounts',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock AdminBranchProvider
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

// Mock runtime features
vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({
  isFrontendDemoModeEnabled: () => true,
}));

// Mock apexcharts
vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mock-apexchart">Chart</div>,
}));

describe('Admin Accounts & Assets Missing Controls Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Daily Settlement (कैश हैंडओवर क्लोजिंग)', () => {
    it('renders CSV, Excel, and Print Summary buttons on settlement page', () => {
      render(
        <NextIntlClientProvider locale="en" messages={dailySettlementMessages}>
          <AdminAccountsDailySettlementPage />
        </NextIntlClientProvider>
      );

      expect(screen.getByRole('button', { name: /CSV/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Excel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Print Summary/i })).toBeInTheDocument();
    });

    it('triggers CSV and Excel downloads on button click', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      render(
        <NextIntlClientProvider locale="en" messages={dailySettlementMessages}>
          <AdminAccountsDailySettlementPage />
        </NextIntlClientProvider>
      );

      const csvBtn = screen.getByRole('button', { name: /CSV/i });
      fireEvent.click(csvBtn);
      expect(clickSpy).toHaveBeenCalled();

      const excelBtn = screen.getByRole('button', { name: /Excel/i });
      fireEvent.click(excelBtn);
      expect(clickSpy).toHaveBeenCalledTimes(2);
    });

    it('prints daily settlement voucher with opening cash, handover and variance', () => {
      const writeMock = vi.fn();
      const closeMock = vi.fn();
      const openMock = vi.fn();
      const mockWindow = {
        document: {
          open: openMock,
          write: writeMock,
          close: closeMock,
        },
      };
      vi.spyOn(window, 'open').mockReturnValue(mockWindow as any);

      const sampleRecord = ADMIN_DAILY_SETTLEMENT_FIXTURES[0];
      printDailySettlementVoucher(sampleRecord);

      expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=750,height=800');
      expect(writeMock).toHaveBeenCalled();
      const htmlWritten = writeMock.mock.calls[0][0];
      expect(htmlWritten).toContain('Daily Cash Closing & Handover Voucher');
      expect(htmlWritten).toContain(sampleRecord.branchName);
      expect(htmlWritten).toContain(sampleRecord.managerName);
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('2. Expenses Ledger (खर्च प्रबंधन)', () => {
    it('renders Export CSV and Excel buttons in HeaderSection', () => {
      const onExportCsv = vi.fn();
      const onExportExcel = vi.fn();

      render(
        <NextIntlClientProvider locale="en" messages={expensesMessages}>
          <AdminAccountsExpensesHeaderSection
            onAddExpense={vi.fn()}
            canMutate={true}
            onExportCsv={onExportCsv}
            onExportExcel={onExportExcel}
          />
        </NextIntlClientProvider>
      );

      const csvBtn = screen.getByTitle('Export Expenses CSV');
      expect(csvBtn).toBeInTheDocument();
      fireEvent.click(csvBtn);
      expect(onExportCsv).toHaveBeenCalledTimes(1);

      const excelBtn = screen.getByTitle('Export Formatted Excel Sheet (.xls)');
      expect(excelBtn).toBeInTheDocument();
      fireEvent.click(excelBtn);
      expect(onExportExcel).toHaveBeenCalledTimes(1);
    });

    it('renders Date Range filter with Last Month and Custom range in FilterSection', () => {
      const onTimeRangeChange = vi.fn();
      const onCustomStartDateChange = vi.fn();
      const onCustomEndDateChange = vi.fn();
      const onExportCsv = vi.fn();
      const onExportExcel = vi.fn();

      render(
        <NextIntlClientProvider locale="en" messages={expensesMessages}>
          <AdminAccountsExpensesFilterSection
            value="all"
            onChange={vi.fn()}
            timeRange="custom"
            onTimeRangeChange={onTimeRangeChange}
            customStartDate="2026-10-01"
            onCustomStartDateChange={onCustomStartDateChange}
            customEndDate="2026-10-31"
            onCustomEndDateChange={onCustomEndDateChange}
            onExportCsv={onExportCsv}
            onExportExcel={onExportExcel}
          />
        </NextIntlClientProvider>
      );

      const select = screen.getByLabelText('Filter expenses by date range');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();

      const startInput = screen.getByLabelText('Start date filter');
      expect(startInput).toHaveValue('2026-10-01');
      fireEvent.change(startInput, { target: { value: '2026-10-05' } });
      expect(onCustomStartDateChange).toHaveBeenCalledWith('2026-10-05');

      const endInput = screen.getByLabelText('End date filter');
      expect(endInput).toHaveValue('2026-10-31');
      fireEvent.change(endInput, { target: { value: '2026-10-25' } });
      expect(onCustomEndDateChange).toHaveBeenCalledWith('2026-10-25');

      const exportCsvBtn = screen.getByTitle('Export Expenses as CSV');
      fireEvent.click(exportCsvBtn);
      expect(onExportCsv).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. Financial Reports (वित्तीय रिपोर्ट)', () => {
    it('renders Custom Date Picker button and inputs on Financial Reports page', () => {
      render(
        <NextIntlClientProvider locale="en" messages={financialReportsMessages}>
          <AdminAccountsFinancialReportsPage />
        </NextIntlClientProvider>
      );

      // Period buttons: Monthly, Quarterly, Yearly, Custom Range
      const customBtn = screen.getByRole('button', { name: /Custom Range/i });
      expect(customBtn).toBeInTheDocument();

      fireEvent.click(customBtn);
      expect(customBtn).toHaveAttribute('aria-pressed', 'true');

      // Date inputs appear
      const startInput = screen.getByLabelText('Report start date');
      const endInput = screen.getByLabelText('Report end date');
      expect(startInput).toBeInTheDocument();
      expect(endInput).toBeInTheDocument();

      fireEvent.change(startInput, { target: { value: '2026-09-01' } });
      expect(startInput).toHaveValue('2026-09-01');

      // Action buttons: Print, CSV, Excel, PDF
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
      vi.spyOn(window, 'open').mockReturnValue(mockWindow as any);

      printFinancialReport({
        period: 'yearly',
        rows: [{ month: 'Period Total', incomeMinor: 33900000, expenseMinor: 13600000 }],
        categories: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
        totalIncomeMinor: 33900000,
        totalExpenseMinor: 13600000,
      });

      expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=900,height=800');
      expect(writeMock).toHaveBeenCalled();
      const htmlWritten = writeMock.mock.calls[0][0];
      expect(htmlWritten).toContain('Official Executive Financial Statement & P&L Audit');
      expect(htmlWritten).toContain('Chief Accounts Officer');
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('4. Assets Register (एसेट्स रजिस्टर)', () => {
    it('renders Export CSV and Export Excel buttons on Assets Register page', () => {
      render(
        <NextIntlClientProvider locale="en" messages={assetsMessages}>
          <AdminAssetsRegisterPage />
        </NextIntlClientProvider>
      );

      expect(screen.getByTitle('Export Asset Register as CSV')).toBeInTheDocument();
      expect(screen.getByTitle('Export Asset Register as Formatted Excel (.xls)')).toBeInTheDocument();
    });

    it('triggers CSV and Excel downloads when export buttons are clicked', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      render(
        <NextIntlClientProvider locale="en" messages={assetsMessages}>
          <AdminAssetsRegisterPage />
        </NextIntlClientProvider>
      );

      const csvBtn = screen.getByTitle('Export Asset Register as CSV');
      fireEvent.click(csvBtn);
      expect(clickSpy).toHaveBeenCalledTimes(1);

      const excelBtn = screen.getByTitle('Export Asset Register as Formatted Excel (.xls)');
      fireEvent.click(excelBtn);
      expect(clickSpy).toHaveBeenCalledTimes(2);
    });
  });
});
