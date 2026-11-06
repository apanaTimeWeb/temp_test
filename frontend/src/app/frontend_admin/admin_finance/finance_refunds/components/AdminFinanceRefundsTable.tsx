'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { getAdminFinanceRefundStatusLabelKey } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsRefundStatus';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';

const ADMIN_FINANCE_REFUND_STATUS_BADGE: Record<AdminFinanceRefund['status'], string> = {
  pending: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg',
  approved: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg',
  rejected: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
  processed: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-info-bg text-info-text border-info-bg',
};

type RefundSortField = 'studentName' | 'branchName' | 'exitDate' | 'depositHeld' | 'deductionAmount' | 'netRefund' | 'status' | 'paymentMethod';

interface AdminFinanceRefundsTableProps {
  refunds: AdminFinanceRefund[];
  isPending: boolean;
  selectedBranchName?: string;
  onApprove: (refund: AdminFinanceRefund) => void;
  onReject: (refund: AdminFinanceRefund) => void;
}

export function AdminFinanceRefundsTable({
  refunds,
  isPending,
  selectedBranchName,
  onApprove,
  onReject,
}: AdminFinanceRefundsTableProps) {
  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const [sortField, setSortField] = useState<RefundSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: RefundSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRefunds = useMemo(() => {
    if (!sortField) return refunds;
    return [...refunds].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = aVal - bVal;
        return sortDirection === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [refunds, sortField, sortDirection]);

  const paginated = useMemo(
    () => sortedRefunds.slice(page * pageSize, (page + 1) * pageSize),
    [sortedRefunds, page, pageSize]
  );

  const renderSortableHeader = (
    field: RefundSortField,
    label: string,
    align: 'left' | 'right' | 'center' = 'left',
    extraClass: string = ''
  ) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 whitespace-nowrap ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'} ${extraClass}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${
            align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''
          }`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="min-w-230 w-full text-left">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              {renderSortableHeader('studentName', t('STUDENT'), 'left', 'sticky left-0 bg-surface-highlight')}
              {renderSortableHeader('branchName', 'Branch')}
              {renderSortableHeader('exitDate', t('EXIT_DATE'))}
              {renderSortableHeader('depositHeld', t('DEPOSIT_HELD'), 'right')}
              {renderSortableHeader('deductionAmount', t('DEDUCTION'), 'right')}
              {renderSortableHeader('netRefund', t('NET_REFUND'), 'right')}
              {renderSortableHeader('status', t('STATUS'))}
              {renderSortableHeader('paymentMethod', t('PROCESSING'))}
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`refund-skeleton-${index}`} className="h-12 border-b border-border text-text-primary">
                  {Array.from({ length: 8 }).map((__, columnIndex) => (
                    <td key={`refund-skeleton-${index}-${columnIndex}`} className="py-3 px-4">
                      <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : refunds.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                    <p className="text-section-title font-semibold text-text-primary">{t('REFUND_EMPTY')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((refund) => (
                <tr
                  key={refund.id}
                  className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra"
                >
                  <td className="py-3 px-4 sticky left-0 bg-inherit">
                    <div className="text-body font-semibold text-text-primary">{refund.studentName}</div>
                    <div className="text-caption text-text-secondary">{refund.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary whitespace-nowrap">
                      <Building2 size={12} className="text-primary shrink-0" />
                      <span>{refund.branchName ?? selectedBranchName ?? 'Downtown Central'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">
                    {refund.exitDate ? formatDate(refund.exitDate) : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">
                    {formatAdminFinanceApiAmount(refund.depositHeld, refund.currencyCode, refund.amountUnit)}
                  </td>
                  <td className={`py-3 px-4 text-right ${refund.deductionAmount > 0 ? 'text-danger-text' : 'text-text-secondary'}`}>
                    {refund.deductionAmount > 0 ? `-${formatAdminFinanceApiAmount(refund.deductionAmount, refund.currencyCode, refund.amountUnit)}` : t('NONE')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-success-text">
                    {formatAdminFinanceApiAmount(refund.netRefund, refund.currencyCode, refund.amountUnit)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={ADMIN_FINANCE_REFUND_STATUS_BADGE[refund.status]}>
                      {t(getAdminFinanceRefundStatusLabelKey(refund.status))}
                    </span>
                    {refund.status === 'rejected' && refund.rejectionReason ? (
                      <div className="text-caption text-text-secondary mt-1 max-w-48 truncate">
                        {refund.rejectionReason}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">
                    {refund.status === 'pending' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="rounded px-2.5 py-1 text-xs font-semibold bg-success-bg text-success-text hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                          onClick={() => onApprove(refund)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded px-2.5 py-1 text-xs font-semibold bg-danger-bg text-danger-text hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                          onClick={() => onReject(refund)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : refund.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success-text">
                        ✓ Approved
                      </span>
                    ) : refund.status === 'processed' ? (
                      `${refund.processedDate ? formatDate(refund.processedDate) : t('PROCESSED_FALLBACK')}${refund.paymentMethod ? ` · ${refund.paymentMethod}` : ''}`
                    ) : (
                      t('REFUND_VIEW_ONLY')
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AdminTablePagination
        page={page}
        pageSize={pageSize}
        totalRows={refunds.length}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(0);
        }}
      />
    </div>
  );
}

export default AdminFinanceRefundsTable;

