// RESPONSIBILITY: AdminFinanceRefundsPage component owned by admin_finance; responsibility folder: components.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminFinanceRefundsQuery from '@/app/frontend_admin/admin_finance/finance_refunds/hooks/useAdminFinanceRefundsQuery';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminFinanceRefundApiRecord } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { getAdminFinanceRefundStatusLabelKey } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsRefundStatus';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';


const ADMIN_FINANCE_REFUND_STATUS_BADGE: Record<AdminFinanceRefund['status'], string> = {
  pending: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg',
  approved: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg',
  rejected: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
  processed: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-info-bg text-info-text border-info-bg',
};

function mapAdminFinanceRefund(record: AdminFinanceRefundApiRecord): AdminFinanceRefund {
  return {
    id: record.id,
    studentName: record.studentName,
    smartId: record.smartId ?? '—',
    exitDate: record.exitDate,
    depositHeld: record.depositHeld,
    deductionAmount: record.deductionAmount,
    netRefund: record.netRefund,
    currencyCode: record.currencyCode,
    amountUnit: record.amountUnit,
    status: record.status,
    processedDate: record.processedDate,
    paymentMethod: record.paymentMethod,
    rejectionReason: record.rejectionReason,
  };
}

export function AdminFinanceRefundsPage() {
  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinanceRefund['status']>('statusFilter', 'all', { validValues: ['all', 'pending', 'approved', 'rejected', 'processed'] });
  const refundsQuery = useAdminFinanceRefundsQuery();
  const allRefunds = useMemo(() => (refundsQuery.data ?? []).map(mapAdminFinanceRefund), [refundsQuery.data]);
  const isPending = refundsQuery.isPending;
  const loadError = refundsQuery.isError ? t('REFUND_LOAD_ERROR') : null;

  const filtered = useMemo(() => allRefunds.filter((refund) => statusFilter === 'all' || refund.status === statusFilter), [allRefunds, statusFilter]);
  const processedRefunds = allRefunds.filter((refund) => refund.status === 'processed');
  const totalRefunded = processedRefunds.reduce((sum, refund) => sum + refund.netRefund, 0);
  const firstProcessedRefund = processedRefunds[0];
  const hasSingleCurrencyUnit = Boolean(firstProcessedRefund?.currencyCode && firstProcessedRefund.amountUnit && processedRefunds.every((refund) => refund.currencyCode === firstProcessedRefund.currencyCode && refund.amountUnit === firstProcessedRefund.amountUnit));
  const pendingCount = allRefunds.filter((refund) => refund.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div><h1 className="text-page-title font-bold text-text-primary">{t('REFUND_TITLE')}</h1><p className="mt-1 text-body text-text-secondary">{t('REFUND_SUBTITLE')}</p></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('TOTAL_REFUNDED')}</p><p className="mt-1 text-page-title font-bold text-text-primary text-success-text">{isPending || loadError ? '—' : formatAdminFinanceApiAmount(totalRefunded, hasSingleCurrencyUnit ? firstProcessedRefund?.currencyCode : undefined, hasSingleCurrencyUnit ? firstProcessedRefund?.amountUnit : undefined)}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('PENDING')}</p><p className="mt-1 text-page-title font-bold text-text-primary text-warning-text">{isPending || loadError ? '—' : pendingCount}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('APPROVED')}</p><p className="mt-1 text-page-title font-bold text-text-primary">{isPending || loadError ? '—' : allRefunds.filter((refund) => refund.status === 'approved').length}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('REJECTED')}</p><p className="mt-1 text-page-title font-bold text-text-primary text-danger-text">{isPending || loadError ? '—' : allRefunds.filter((refund) => refund.status === 'rejected').length}</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="finance-refund-status">{t('FILTER_REFUND_STATUS')}</label>
        <select id="finance-refund-status" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminFinanceRefund['status'])}>
          <option value="all">{t('ALL_STATUS')}</option><option value="pending">{t('PENDING')}</option><option value="approved">{t('APPROVED')}</option><option value="processed">{t('PROCESSED')}</option><option value="rejected">{t('REJECTED')}</option>
        </select>
      </div>
      {loadError ? <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center" role="alert"><p className="text-section-title font-semibold text-text-primary">{t('REFUND_UNABLE')}</p><p className="text-caption text-text-secondary">{loadError}</p><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover mt-3" onClick={() => void refundsQuery.refetch()} disabled={refundsQuery.isFetching}>{t('RETRY')}</button></div> : <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="min-w-230 w-full">
          <thead><tr className="bg-surface-highlight text-caption text-text-secondary">
            <th scope="col" className="text-left py-3 px-4 sticky left-0 bg-card">{t('STUDENT')}</th><th scope="col" className="text-left py-3 px-4">{t('EXIT_DATE')}</th><th scope="col" className="text-right py-3 px-4">{t('DEPOSIT_HELD')}</th><th scope="col" className="text-right py-3 px-4">{t('DEDUCTION')}</th><th scope="col" className="text-right py-3 px-4">{t('NET_REFUND')}</th><th scope="col" className="text-left py-3 px-4">{t('STATUS')}</th><th scope="col" className="text-left py-3 px-4">{t('PROCESSING')}</th>
          </tr></thead>
          <tbody>
            {isPending ? Array.from({ length: 5 }).map((_, index) => <tr key={`refund-skeleton-${index}`} className="border-b border-border text-text-primary">{Array.from({ length: 7 }).map((__, columnIndex) => <td key={`refund-skeleton-${index}-${columnIndex}`} className="py-3 px-4"><div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" /></td>)}</tr>) : filtered.length === 0 ? <tr><td colSpan={7}><div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center"><p className="text-section-title font-semibold text-text-primary">{t('REFUND_EMPTY')}</p></div></td></tr> : filtered.map((refund) => <tr key={refund.id} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
              <td className="py-3 px-4 sticky left-0 bg-card"><div className="text-body font-semibold text-text-primary">{refund.studentName}</div><div className="text-caption text-text-secondary">{refund.smartId}</div></td>
              <td className="py-3 px-4 text-caption text-text-secondary">{refund.exitDate ? formatDate(refund.exitDate) : '—'}</td>
              <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">{formatAdminFinanceApiAmount(refund.depositHeld, refund.currencyCode, refund.amountUnit)}</td>
              <td className={`py-3 px-4 text-right ${refund.deductionAmount > 0 ? 'text-danger-text' : 'text-text-secondary'}`}>{refund.deductionAmount > 0 ? `-${formatAdminFinanceApiAmount(refund.deductionAmount, refund.currencyCode, refund.amountUnit)}` : t('NONE')}</td>
              <td className="py-3 px-4 text-right font-semibold text-success-text">{formatAdminFinanceApiAmount(refund.netRefund, refund.currencyCode, refund.amountUnit)}</td>
              <td className="py-3 px-4"><span className={ADMIN_FINANCE_REFUND_STATUS_BADGE[refund.status]}>{t(getAdminFinanceRefundStatusLabelKey(refund.status))}</span>{refund.status === 'rejected' && refund.rejectionReason ? <div className="text-caption text-text-secondary mt-1 max-w-48 truncate">{refund.rejectionReason}</div> : null}</td>
              <td className="py-3 px-4 text-caption text-text-secondary">{refund.status === 'processed' ? `${refund.processedDate ? formatDate(refund.processedDate) : t('PROCESSED_FALLBACK')}${refund.paymentMethod ? ` · ${refund.paymentMethod}` : ''}` : t('REFUND_VIEW_ONLY')}</td>
            </tr>)}
          </tbody>
        </table>
        <p className="text-caption text-text-secondary px-4 py-3">{t('MOBILE_REFUND_NOTE')}</p>
      </div>}
    </div>
  );
}
