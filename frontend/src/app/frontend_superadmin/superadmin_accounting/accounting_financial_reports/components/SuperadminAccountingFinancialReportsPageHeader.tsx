// RESPONSIBILITY: Present the financial-reports page heading, sample notice and localized period selector.
'use client';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_ACCOUNTING_REPORT_PERIODS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/mocks/fixtures/SuperadminAccountingFinancialReportsFinancialReportMockFixtures';
import type { SuperadminAccountingPeriod } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/types/superadmin_accounting_financial_reports.types';
type Props = { period: SuperadminAccountingPeriod; onPeriodChange: (nextPeriod: SuperadminAccountingPeriod) => void };
export default function SuperadminAccountingFinancialReportsPageHeader({ period, onPeriodChange }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return <>
    <p className="rounded-md border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy('COPY.SAMPLE_REPORT_DATA_PERIOD_SELECTION_UPDATES_THE_DISPLAYED_SAMPLE_MONTHS_AND_TOTALS_A_VERIFIED_LIVE_REPORTING_CONTRACT_WAS_NOT_SUPPLIED')}</p>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="acct-page-title">{tCopy('COPY.FINANCIAL_REPORTS')}</h1><p className="acct-page-subtitle">{tCopy('COPY.INCOME_VS_EXPENSE_OVERVIEW_AND_CATEGORY_BREAKDOWN')}</p></div>
      <div className="flex gap-2" role="group" aria-label={tCopy('COPY.REPORT_PERIOD')}>{SUPERADMIN_ACCOUNTING_REPORT_PERIODS.map((option) => <button type="button" key={option} aria-pressed={period === option} onClick={() => onPeriodChange(option)} className={`acct-badge cursor-pointer ${period === option ? 'acct-badge--info' : 'acct-badge--neutral'}`} data-testid={`superadmin-accounting-accounting-financial-reports-set-period-1-${option}`}>{tCopy(`COPY.${option.toUpperCase()}`)}</button>)}</div>
    </div>
  </>;
}
