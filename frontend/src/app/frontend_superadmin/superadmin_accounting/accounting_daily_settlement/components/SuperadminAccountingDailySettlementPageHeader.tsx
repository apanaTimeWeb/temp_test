'use client';
/** Responsibility: Present the daily settlement page title, sample-data notice and date filter. */
import { useTranslations } from 'next-intl';
type Props = { date: string; onDateChange: (nextDate: string) => void };
export default function SuperadminAccountingDailySettlementPageHeader({ date, onDateChange }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return <>
    <p className="rounded-md border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy('COPY.SAMPLE_DATA_THE_DATE_SELECTOR_FILTERS_THE_INCLUDED_PREVIEW_ROWS_SETTLEMENT_ACTIONS_UPDATE_THIS_PREVIEW_ONLY_NO_BACKEND_SETTLEMENT_CONTRACT_WAS_SUPPLIED')}</p>
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div><h1 className="acct-page-title">{tCopy('COPY.DAILY_SETTLEMENT')}</h1><p className="acct-page-subtitle">{tCopy('COPY.SHIFT_WISE_CASH_UPI_RECONCILIATION')}</p></div>
      <label className="flex flex-col gap-1 text-sm"><span className="sr-only">{tCopy('COPY.DATE')}</span><input aria-label={tCopy('COPY.DATE')} type="date" className="acct-input w-44" value={date} onChange={(event) => onDateChange(event.currentTarget.value)} data-testid="superadmin-accounting-accounting-daily-settlement-date-2" /></label>
    </div>
  </>;
}
