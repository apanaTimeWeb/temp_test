// RESPONSIBILITY: Render the payment-promises title, sample notice and localized status filter.
'use client';
import { useTranslations } from 'next-intl';
type Props = { statusFilter: string; onStatusChange: (nextStatus: string) => void };
export default function SuperadminBillingOverviewMemberPaymentPromisesPageHeader({ statusFilter, onStatusChange }: Props) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  return <>
    <div><h1 className="fin-page-title">{tCopy('COPY.PAYMENT_PROMISES')}</h1><p className="fin-page-subtitle">{tCopy('COPY.TRACK_AND_MANAGE_STUDENT_PAYMENT_COMMITMENTS')}</p></div>
    <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy('COPY.PAYMENT_PROMISE_DATA_IS_ILLUSTRATIVE_FULFILLMENT_CANNOT_BE_CONFIRM_4EA1287B')}</p>
    <div className="fin-filter-bar">
      <label className="sr-only" htmlFor="payment-promises-status-filter">{tCopy('COPY.STATUS_FILTER')}</label>
      <select id="payment-promises-status-filter" aria-label={tCopy('COPY.STATUS_FILTER')} className="fin-select w-40" value={statusFilter} onChange={(event) => onStatusChange(event.currentTarget.value)} data-testid="superadmin-finance-finance-payment-promises-status-filter-1">
        <option value="all">{tCopy('COPY.ALL_STATUS')}</option><option value="pending">{tCopy('COPY.PENDING_2')}</option><option value="fulfilled">{tCopy('COPY.FULFILLED')}</option><option value="overdue">{tCopy('COPY.OVERDUE')}</option>
      </select>
    </div>
  </>;
}
