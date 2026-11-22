'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.

import { AdminAccountsFinancialReportsDashboard } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsDashboard';
import {
ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/mocks/AdminAccountsFinancialReportsFixtures';
import type { AdminAccountingFinancialReportPeriod } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';
import {
downloadFinancialReportPdf,
exportFinancialReportCsv,
exportFinancialReportExcel,
printFinancialReport,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsExporter';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { BarChart3,Calendar,Download,FileSpreadsheet,Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';
import { toast } from 'sonner';

/** Presents report period controls, date range pickers, audit export actions, and gates all sample report data behind explicit demo mode. */
export function AdminAccountsFinancialReportsPage() {
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const [period, setPeriod] = useState<AdminAccountingFinancialReportPeriod>('monthly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const isDemoMode = isFrontendDemoModeEnabled();

  const rows = useMemo(() => {
    if (period === 'monthly') return ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES;
    if (period === 'quarterly') {
      const groups = [
        { month: 'Oct–Dec', source: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.slice(0, 3) },
        { month: 'Jan–Mar', source: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.slice(3, 6) },
        { month: 'Apr', source: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.slice(6, 7) },
      ];
      return groups.map((group) => ({
        month: group.month,
        incomeMinor: group.source.reduce((sum, item) => sum + item.incomeMinor, 0),
        expenseMinor: group.source.reduce((sum, item) => sum + item.expenseMinor, 0),
      }));
    }
    if (period === 'custom') {
      const label = customStartDate && customEndDate
        ? `${customStartDate.slice(5)} ~ ${customEndDate.slice(5)}`
        : 'Custom Window';
      return [{
        month: label,
        incomeMinor: Math.round(ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.incomeMinor, 0) * 0.45),
        expenseMinor: Math.round(ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.expenseMinor, 0) * 0.45),
      }];
    }
    return [{
      month: 'Period Total',
      incomeMinor: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.incomeMinor, 0),
      expenseMinor: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.expenseMinor, 0),
    }];
  }, [period, customStartDate, customEndDate]);

  const totalIncomeMinor = rows.reduce((sum, row) => sum + row.incomeMinor, 0);
  const totalExpenseMinor = rows.reduce((sum, row) => sum + row.expenseMinor, 0);

  const exportSpec = useMemo(() => ({
    period,
    rows,
    categories: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES,
    totalIncomeMinor,
    totalExpenseMinor,
    customStartDate,
    customEndDate,
  }), [period, rows, totalIncomeMinor, totalExpenseMinor, customStartDate, customEndDate]);

  const handleExportCsv = () => {
    exportFinancialReportCsv(exportSpec);
    toast.success('Downloaded Financial Statement as CSV');
  };

  const handleExportExcel = () => {
    exportFinancialReportExcel(exportSpec);
    toast.success('Downloaded Financial Statement as Excel (.xls)');
  };

  const handleExportPdf = () => {
    downloadFinancialReportPdf(exportSpec);
    toast.success('Downloaded Financial Statement as PDF');
  };

  const handlePrint = () => {
    printFinancialReport(exportSpec);
    toast.info('Opening A4 printable financial statement');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            <span>Executive Financial Audit</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('SUBTITLE')}</p>
        </div>

        {isDemoMode && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Action Buttons: Print & Exports */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card/50 p-1 shadow-xs">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                title="Print A4 Financial Statement Report"
              >
                <Printer className="h-3.5 w-3.5 text-slate-400" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                title="Export P&L Report as CSV"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                title="Export P&L Report as Formatted Excel (.xls)"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                title="Download Financial Audit Statement as PDF"
              >
                <Download className="h-3.5 w-3.5 text-rose-400" />
                <span>PDF</span>
              </button>
            </div>

            {/* Reporting Horizon Selector */}
            <div className="flex flex-wrap items-center gap-2" aria-label={t('REPORT_PERIOD')}>
              {(['monthly', 'quarterly', 'yearly', 'custom'] as const).map((nextPeriod) => (
                <button
                  type="button"
                  aria-pressed={period === nextPeriod}
                  key={nextPeriod}
                  onClick={() => setPeriod(nextPeriod)}
                  className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    period === nextPeriod
                      ? 'border-primary bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                      : 'border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {nextPeriod === 'custom' && <Calendar className="h-3.5 w-3.5" />}
                  {t(`PERIOD_${nextPeriod.toUpperCase()}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Range Picker Bar */}
      {isDemoMode && period === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Custom Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="custom-report-start" className="sr-only">Start Date</label>
            <input maxLength={30}
              id="custom-report-start"
              type="date"
              aria-label="Report start date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-9"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <label htmlFor="custom-report-end" className="sr-only">End Date</label>
            <input maxLength={30}
              id="custom-report-end"
              type="date"
              aria-label="Report end date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-9"
            />
          </div>
          {(customStartDate || customEndDate) && (
            <button
              type="button"
              onClick={() => {
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-secondary hover:bg-card-hover hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {!isDemoMode ? (
        <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6" aria-labelledby="accounting-report-unavailable-title">
          <h2 id="accounting-report-unavailable-title" className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('LIVE_TITLE')}</h2>
          <p className="text-warning-text" role="status">{t('LIVE_UNAVAILABLE')}</p>
        </section>
      ) : (
        <>
          <p role="status" className="sr-only">{t('DEMO_PREVIEW')}</p>
          <AdminAccountsFinancialReportsDashboard
            period={period}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        </>
      )}
    </div>
  );
}
