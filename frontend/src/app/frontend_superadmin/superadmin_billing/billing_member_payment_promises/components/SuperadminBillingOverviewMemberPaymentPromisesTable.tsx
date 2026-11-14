// RESPONSIBILITY: Render the filtered payment-promises table and its explicitly disabled/preview-only actions.
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { CalendarPlus, CheckCircle, Eye } from 'lucide-react';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/utils/SuperadminBillingOverviewMemberPaymentPromisesFormatters';
import { SUPERADMIN_FINANCE_PAYMENT_PROMISES_PAGE_CLIENT_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/constants/superadmin_billing_member_payment_promises.constants';
import type { PromiseItem } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/types/superadmin_billing_member_payment_promises.types';
type Props = { rows: readonly PromiseItem[]; onOpenExtension: (promise: PromiseItem, trigger: HTMLButtonElement) => void };
export default function SuperadminBillingOverviewMemberPaymentPromisesTable({ rows, onOpenExtension }: Props) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const statusLabels = { pending: tCopy('COPY.PROMISE_STATUS_PENDING'), fulfilled: tCopy('COPY.PROMISE_STATUS_FULFILLED'), overdue: tCopy('COPY.PROMISE_STATUS_OVERDUE') };
  return <div className="fin-card overflow-x-auto">
    <table className="w-full">
      <thead><tr className="fin-table-header-row">
        <th scope="col" className="text-left py-3 px-4">{tCopy('COPY.STUDENT')}</th><th scope="col" className="text-right py-3 px-4">{tCopy('COPY.PROMISED')}</th><th scope="col" className="text-left py-3 px-4">{tCopy('COPY.EXPECTED_DATE')}</th><th scope="col" className="text-left py-3 px-4">{tCopy('COPY.DAYS_UNTIL_SINCE_DUE')}</th><th scope="col" className="text-left py-3 px-4">{tCopy('COPY.TIMES_CHANGED')}</th><th scope="col" className="text-left py-3 px-4">{tCopy('COPY.STATUS')}</th><th scope="col" className="text-right py-3 px-4">{tCopy('COPY.ACTIONS')}</th>
      </tr></thead>
      <tbody>{rows.length === 0 ? <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon" aria-hidden="true">🤝</div><p className="fin-empty-state__title" role="status">{tCopy('COPY.NO_PAYMENT_PROMISES_RECORDED')}</p></div></td></tr> : rows.map((promise) => (
        <tr key={promise.id} className="fin-table-hover-row fin-table-row">
          <td className="py-3 px-4"><div className="fin-cell-name">{promise.studentName}</div><div className="fin-cell-subtext">{promise.smartId}</div></td>
          <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatMajorUnitPreviewCurrency(promise.promisedAmount, 'INR', locale)}</td>
          <td className="py-3 px-4 fin-cell-subtext">{promise.expectedDate}</td>
          <td className="py-3 px-4"><span className={promise.daysUntilDue < 0 ? 'fin-text-danger font-semibold' : promise.daysUntilDue <= 3 ? 'fin-text-warning' : 'fin-text-body'}>{Math.abs(promise.daysUntilDue)} {tCopy('COPY.DAY_ABBREVIATION')}{promise.daysUntilDue < 0 ? ` ${tCopy('COPY.DAYS_OVERDUE')}` : ''}</span></td>
          <td className="py-3 px-4">{promise.timesChanged >= 3 ? <span className="fin-badge fin-badge--danger">{promise.timesChanged}{tCopy('COPY.X_CHANGED')}</span> : promise.timesChanged > 0 ? <span className="fin-badge fin-badge--warning">{promise.timesChanged}{tCopy('COPY.X_CHANGED')}</span> : <span className="fin-text-muted">—</span>}</td>
          <td className="py-3 px-4"><span className={SUPERADMIN_FINANCE_PAYMENT_PROMISES_PAGE_CLIENT_STATUS_BADGE[promise.status]}>{statusLabels[promise.status]}</span></td>
          <td className="py-3 px-4">{promise.status !== 'fulfilled' ? <div className="flex items-center justify-end gap-2">
            <button type="button" className="fin-badge fin-badge--success opacity-60 cursor-not-allowed" disabled aria-label={tCopy('COPY.MARK_PAYMENT_PROMISE_PAID_UNAVAILABLE_ARIA_LABEL', { name: promise.studentName })} title={tCopy('COPY.UNAVAILABLE_NO_VERIFIED_PAYMENT_RECONCILIATION_API_IS_SUPPLIED_NO__45334E0B')} data-testid={`superadmin-finance-finance-payment-promises-mark-payment-promise-paid-unavailable-aria-label-2-${promise.id}`}><CheckCircle size={18} aria-hidden="true" /> {tCopy('COPY.MARK_PAID_UNAVAILABLE')}</button>
            <button type="button" className="fin-badge fin-badge--warning cursor-pointer" onClick={(event) => onOpenExtension(promise, event.currentTarget)} aria-label={tCopy('COPY.PREVIEW_LOCAL_EXPECTED_DATE_CHANGE_ARIA_LABEL', { name: promise.studentName })} data-testid={`superadmin-finance-finance-payment-promises-preview-local-expected-date-change-aria-label-3-${promise.id}`}><CalendarPlus size={18} aria-hidden="true" /> {tCopy('COPY.EXTEND_DATE')}</button>
            <button type="button" disabled title={tCopy('COPY.UNAVAILABLE_NO_ACTION_CONTRACT_IS_SUPPLIED_FOR_THIS_RECORD')} className="fin-badge fin-badge--neutral opacity-60 cursor-not-allowed" data-testid={`superadmin-finance-finance-payment-promises-unavailable-no-action-contract-is-supplied-for-this-record-4-${promise.id}`}><Eye size={18} aria-hidden="true" /> {tCopy('COPY.VIEW')}</button>
          </div> : <span className="fin-cell-subtext">{tCopy('COPY.PAID_ON')}{promise.fulfilledDate}</span>}</td>
        </tr>
      ))}</tbody>
    </table>
  </div>;
}
