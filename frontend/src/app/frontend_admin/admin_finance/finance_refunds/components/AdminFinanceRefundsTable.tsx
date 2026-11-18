'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, ArrowUpDown, ArrowUp, ArrowDown, Check, X, CheckCircle2, Eye, FileText, MessageSquare, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { getAdminFinanceRefundStatusLabelKey } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsRefundStatus';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { downloadRefundVoucherPdf, buildWhatsAppLink } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';

const ADMIN_FINANCE_REFUND_STATUS_BADGE: Record<AdminFinanceRefund['status'], string> = {
  pending: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-amber-600 dark:text-amber-400',
  approved: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-emerald-600 dark:text-emerald-400',
  rejected: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-rose-600 dark:text-rose-400',
  processed: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-cyan-600 dark:text-cyan-400',
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
                      <div className="text-caption text-text-secondary mt-1 max-w-48 truncate">
                        {refund.rejectionReason}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">
                    <div className="flex items-center gap-2">
                      {refund.status === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer transition-all"
                            onClick={() => onApprove(refund)}
                          >
                            <Check size={12} strokeWidth={2.5} /> Approve
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer transition-all"
                            onClick={() => onReject(refund)}
                          >
                            <X size={12} strokeWidth={2.5} /> Reject
                          </button>
                        </div>
                      ) : refund.status === 'approved' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={12} /> Approved
                          </span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer transition-all"
                            onClick={() => onDisburse ? onDisburse(refund) : onViewDetail && onViewDetail(refund)}
                            title="Disburse payment & record transaction UTR"
                          >
                            <RotateCcw size={11} /> Disburse
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
                          className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-colors shadow-xs"
                          onClick={() => {
                            downloadRefundVoucherPdf(refund);
                            toast.success(`Downloaded clearance voucher PDF for ${refund.studentName}`);
                          }}
                          title="Print / Download Refund Voucher PDF"
                          aria-label={`Download refund voucher for ${refund.studentName}`}
                        >
                          <FileText size={13} strokeWidth={2.2} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-xs"
                          onClick={() => {
                            let msg = '';
                            if (refund.status === 'approved') {
                              msg = `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been APPROVED! Method: ${refund.paymentMethod || 'UPI/Bank'}. Ref: ${refund.id}.`;
                            } else if (refund.status === 'rejected') {
                              msg = `Dear ${refund.studentName}, your deposit refund request has been REJECTED. Reason: ${refund.rejectionReason || 'Pending damages/dues'}. Ref: ${refund.id}.`;
                            } else {
                              msg = `Dear ${refund.studentName}, your security deposit refund status is currently ${refund.status.toUpperCase()}. Net amount: ₹${refund.netRefund.toLocaleString('en-IN')}. Ref: ${refund.id}.`;
                            }
                            const waUrl = buildWhatsAppLink(refund.studentPhone, msg);
                            const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
                            if (popup) popup.opener = null;
                            toast.success(`Sent WhatsApp notification to ${refund.studentName}`);
                          }}
                          title="Send WhatsApp / SMS Notification"
                          aria-label={`Send notification to ${refund.studentName}`}
                        >
                          <MessageSquare size={13} strokeWidth={2.2} />
                        </button>
                        {onViewDetail && (
                          <button
                            type="button"
                            className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors shadow-xs"
                            onClick={() => onViewDetail(refund)}
                            title="View refund voucher dialog"
                            aria-label={`View refund voucher for ${refund.studentName}`}
                          >
                            <Eye size={13} strokeWidth={2.2} />
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

