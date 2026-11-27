'use client';

import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { getAdminFinanceRefundStatusLabelKey } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsRefundStatus';
import { buildRefundNotificationMessage } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsExports';
import { buildWhatsAppLink, downloadRefundVoucherPdf } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, Check, CheckCircle2, Eye, FileText, MessageSquare, RotateCcw, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const ADMIN_FINANCE_REFUND_STATUS_BADGE: Record<AdminFinanceRefund['status'], string> = {
  pending: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-warning bg-warning-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-warning-text',
  approved: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-success-text',
  rejected: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-danger bg-danger-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-danger-text',
  processed: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-info bg-info-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-info-text',
};

type RefundSortField = 'studentName' | 'branchName' | 'exitDate' | 'depositHeld' | 'deductionAmount' | 'netRefund' | 'status' | 'paymentMethod';

interface AdminFinanceRefundsTableProps {
  refunds: AdminFinanceRefund[];
  isPending: boolean;
  selectedBranchName?: string;
  onApprove: (refund: AdminFinanceRefund) => void;
  onReject: (refund: AdminFinanceRefund) => void;
  onViewDetail?: (refund: AdminFinanceRefund) => void;
  onDisburse?: (refund: AdminFinanceRefund) => void;
}

export function AdminFinanceRefundsTable({
  refunds,
  isPending,
  selectedBranchName,
  onApprove,
  onReject,
  onViewDetail,
  onDisburse,
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
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
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
                      <Building2 size={12} className="text-primary shrink-0" aria-hidden="true" />
                      <span>{refund.branchName ?? selectedBranchName ?? 'Downtown Central'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">
                    {refund.exitDate ? formatDate(refund.exitDate) : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">
                    {formatAdminFinanceApiAmount(refund.depositHeld, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major')}
                  </td>
                  <td className={`py-3 px-4 text-right ${refund.deductionAmount > 0 ? 'text-danger-text' : 'text-text-secondary'}`}>
                    {refund.deductionAmount > 0 ? `-${formatAdminFinanceApiAmount(refund.deductionAmount, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major')}` : t('NONE')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-success-text">
                    {formatAdminFinanceApiAmount(refund.netRefund, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={ADMIN_FINANCE_REFUND_STATUS_BADGE[refund.status]}>
                      {t(getAdminFinanceRefundStatusLabelKey(refund.status))}
                    </span>
                    {refund.status === 'rejected' && refund.rejectionReason ? (
                      <div className="text-caption text-text-secondary mt-1 max-w-48 truncate">{refund.rejectionReason}</div>
                    ) : null}
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">
                    <div className="flex items-center gap-2">
                      {refund.status === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold bg-success text-on-primary hover:opacity-90 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success cursor-pointer motion-safe:transition-opacity"
                            onClick={() => onApprove(refund)}
                          >
                            <Check size={12} strokeWidth={2.5} aria-hidden="true" /> Approve
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-danger bg-danger-bg px-2.5 py-1 text-xs font-semibold text-danger-text hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger cursor-pointer motion-safe:transition-opacity"
                            onClick={() => onReject(refund)}
                          >
                            <X size={12} strokeWidth={2.5} aria-hidden="true" /> Reject
                          </button>
                        </div>
                      ) : refund.status === 'approved' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-text bg-success-bg border border-success px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={12} aria-hidden="true" /> Approved
                          </span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold bg-info text-on-primary hover:opacity-90 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info cursor-pointer motion-safe:transition-opacity"
                            onClick={() => (onDisburse ? onDisburse(refund) : onViewDetail && onViewDetail(refund))}
                            title="Disburse payment & record transaction UTR"
                          >
                            <RotateCcw size={11} aria-hidden="true" /> Disburse
                          </button>
                        </div>
                      ) : refund.status === 'processed' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-xs text-text-primary font-mono font-bold">
                            UTR: {refund.transactionUtr ?? '412398572104'}
                          </span>
                          <span className="block text-[11px] text-text-secondary font-mono">
                            {refund.paymentMethod ?? 'UPI'} · {refund.receiptNumber ?? `RCT-REF-${refund.id}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-secondary italic">{t('REFUND_VIEW_ONLY')}</span>
                      )}

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
                          onClick={() => {
                            downloadRefundVoucherPdf(refund);
                            toast.success(`Downloaded clearance voucher PDF for ${refund.studentName}`, {
                              id: 'refund-table-voucher-downloaded',
                            });
                          }}
                          title="Print / Download Refund Voucher PDF"
                          aria-label={`Download refund voucher for ${refund.studentName}`}
                        >
                          <FileText size={13} strokeWidth={2.2} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-info bg-info-bg text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
                          onClick={() => {
                            const waUrl = buildWhatsAppLink(refund.studentPhone, buildRefundNotificationMessage(refund));
                            const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
                            if (popup) popup.opener = null;
                            toast.success(`Sent WhatsApp notification to ${refund.studentName}`, {
                              id: 'refund-table-whatsapp-sent',
                            });
                          }}
                          title="Send WhatsApp / SMS Notification"
                          aria-label={`Send notification to ${refund.studentName}`}
                        >
                          <MessageSquare size={13} strokeWidth={2.2} aria-hidden="true" />
                        </button>
                        {onViewDetail && (
                          <button
                            type="button"
                            className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
                            onClick={() => onViewDetail(refund)}
                            title="View refund voucher dialog"
                            aria-label={`View refund voucher for ${refund.studentName}`}
                          >
                            <Eye size={13} strokeWidth={2.2} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
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
