'use client';
// Responsibility: AdminFinancePaymentPromisesTable component owned by admin_finance; responsibility folder: admin_finance_payment_promises_sections.

// RESPONSIBILITY: Renders payment-promise records and reports row-action intent to the parent.

import { CalendarPlus, CheckCircle, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminFinancePromiseItem } from '@/app/frontend_admin/admin_finance/finance_payment_promises/types/AdminFinancePaymentPromisesTypes';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_payment_promises/utils/AdminFinancePaymentPromisesFormat';
import type { AdminFinancePaymentPromisesTableProps } from '@/app/frontend_admin/admin_finance/finance_payment_promises/types/AdminFinancePaymentPromisesTypes';


const STATUS_BADGE: Record<AdminFinancePromiseItem['status'], string> = {
  pending: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg',
  fulfilled: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg',
  overdue: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
};

export default function AdminFinancePaymentPromisesTable({ promises, isLoading, onFulfill, onExtend, canMutate }: AdminFinancePaymentPromisesTableProps) {
  const t = useTranslations('ADMIN_FINANCE_PAYMENT_PROMISES');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto" aria-label={t('LEDGER')}>
      <table className="w-full">
        <thead><tr className="bg-surface-highlight text-caption text-text-secondary"><th className="px-4 py-3 text-left">{t('STUDENT')}</th><th className="px-4 py-3 text-right">{t('PROMISED')}</th><th className="px-4 py-3 text-left">{t('EXPECTED_DATE')}</th><th className="px-4 py-3 text-left">{t('DAYS_DUE')}</th><th className="px-4 py-3 text-left">{t('TIMES_CHANGED')}</th><th className="px-4 py-3 text-left">{t('STATUS')}</th><th className="px-4 py-3 text-right">{t('ACTIONS')}</th></tr></thead>
        <tbody>
          {isLoading ? Array.from({ length: 4 }).map((_, rowIndex) => <tr key={rowIndex} className="border-b border-border text-text-primary">{Array.from({ length: 7 }).map((__, cellIndex) => <td key={cellIndex} className="px-4 py-3"><div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-20" /></td>)}</tr>) : promises.length === 0 ? (
            <tr><td colSpan={7}><div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">🤝</div><p className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p></div></td></tr>
          ) : promises.map((promise) => (
            <tr key={promise.id} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
              <td className="px-4 py-3"><div className="text-body font-semibold text-text-primary">{promise.studentName}</div><div className="text-caption text-text-secondary">{promise.smartId}</div></td>
              <td className="px-4 py-3 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(promise.promisedAmount)}</td>
              <td className="px-4 py-3 text-caption text-text-secondary">{promise.expectedDate}</td>
              <td className="px-4 py-3"><span className={promise.daysUntilDue < 0 ? 'text-danger-text font-semibold' : promise.daysUntilDue <= 3 ? 'text-warning-text' : 'text-body text-text-primary'}>{promise.daysUntilDue < 0 ? t('OVERDUE_DAYS', { count: Math.abs(promise.daysUntilDue) }) : t('DAYS', { count: promise.daysUntilDue })}</span></td>
              <td className="px-4 py-3">{promise.timesChanged >= 3 ? <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg">{t('CHANGED', { count: promise.timesChanged })}</span> : promise.timesChanged > 0 ? <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg">{t('CHANGED', { count: promise.timesChanged })}</span> : <span className="text-text-secondary">—</span>}</td>
              <td className="px-4 py-3"><span className={STATUS_BADGE[promise.status] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border'}>{t(promise.status === 'pending' ? 'STATUS_PENDING' : promise.status === 'fulfilled' ? 'STATUS_FULFILLED' : 'STATUS_OVERDUE')}</span></td>
              <td className="px-4 py-3">{promise.status !== 'fulfilled' ? <div className="flex items-center justify-end gap-2">
                <button type="button" data-testid="admin_finance-page-control-008" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" disabled={!canMutate} title={!canMutate ? t('FULFILL_BLOCKED') : undefined} onClick={() => onFulfill(promise.id, promise.studentName)}><CheckCircle size={18} strokeWidth={2} /> {t('MARK_PAID')}</button>
                <button type="button" data-testid="admin_finance-page-control-009" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-warning-bg text-warning-text border-warning-bg cursor-pointer" disabled={!canMutate} title={!canMutate ? t('EXTEND_BLOCKED') : undefined} onClick={() => onExtend({ id: promise.id, name: promise.studentName })}><CalendarPlus size={18} strokeWidth={2} /> {t('EXTEND_DATE')}</button>
                <button type="button" data-testid="admin_finance-page-control-010" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-not-allowed opacity-60" disabled title={t('DETAIL_UNAVAILABLE')}><Eye size={18} strokeWidth={2} /> {t('VIEW')}</button>
              </div> : <span className="text-caption text-text-secondary">{t('PAID_ON', { date: promise.fulfilledDate || '—' })}</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}


export type { AdminFinancePaymentPromisesTableProps };
