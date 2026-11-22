'use client';

import {
AlertTriangle,
Armchair,
ArrowDown,
ArrowUp,
ArrowUpDown,
Building,
Calendar,
ChevronLeft,
ChevronRight,
Minus,
ShieldCheck,
Undo2
} from 'lucide-react';
import type {
AdminFinanceSecurityDeposit,
DepositSortField,
} from '../types/AdminFinanceSecurityDepositsTypes';
import { AdminFinanceSecurityDepositsEmptyState } from './AdminFinanceSecurityDepositsEmptyState';

const STATUS_BADGE: Record<string, string> = {
  held: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  refunded: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  forfeited: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
};

const STATUS_LABEL: Record<string, string> = {
  held: 'In Escrow (Held)',
  refunded: 'Refunded (Cleared)',
  forfeited: 'Forfeited',
};

export interface AdminFinanceSecurityDepositsTableProps {
  filtered: AdminFinanceSecurityDeposit[];
  paginated: AdminFinanceSecurityDeposit[];
  sortField: DepositSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: DepositSortField) => void;
  onOpenRefund: (d: AdminFinanceSecurityDeposit) => void;
  onOpenDeduct: (d: AdminFinanceSecurityDeposit) => void;
  startItem: number;
  endItem: number;
  totalRows: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  effectivePage: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  labels: {
    student: string;
    seatBranch: string;
    deposit: string;
    status: string;
    collectedBy: string;
    collectedDate: string;
    deduction: string;
    refundedDate: string;
    actions: string;
    noDeposits: string;
  };
}

export function AdminFinanceSecurityDepositsTable({
  filtered,
  paginated,
  sortField,
  sortDirection,
  onToggleSort,
  onOpenRefund,
  onOpenDeduct,
  startItem,
  endItem,
  totalRows,
  pageSize,
  onPageSizeChange,
  effectivePage,
  pageCount,
  onPrevPage,
  onNextPage,
  labels,
}: AdminFinanceSecurityDepositsTableProps) {
  const renderSortableHeader = (
    field: DepositSortField,
    label: string,
    align: 'left' | 'right' = 'left'
  ) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-secondary ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 transition-colors cursor-pointer ${
            align === 'right' ? 'ml-auto' : ''
          }`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={13} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={13} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={13} className="text-secondary opacity-40 group-hover:opacity-100 transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full min-w-[950px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-ground">
              {renderSortableHeader('studentName', labels.student, 'left')}
              <th scope="col" className="text-left py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-secondary">
                {labels.seatBranch}
              </th>
              {renderSortableHeader('depositAmount', labels.deposit, 'right')}
              {renderSortableHeader('status', labels.status, 'left')}
              {renderSortableHeader('collectedBy', labels.collectedBy, 'left')}
              {renderSortableHeader('collectedDate', labels.collectedDate, 'left')}
              {renderSortableHeader('deductionAmount', labels.deduction, 'right')}
              {renderSortableHeader('refundedDate', labels.refundedDate, 'left')}
              <th scope="col" className="text-right py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-secondary">
                {labels.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-card text-xs">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12">
                  <AdminFinanceSecurityDepositsEmptyState>
                    <div className="p-3 rounded-full bg-surface-ground border border-border w-12 h-12 flex items-center justify-center mx-auto mb-3 text-secondary">
                      <AlertTriangle size={20} />
                    </div>
                    <p className="font-semibold text-primary">{labels.noDeposits}</p>
                    <p className="text-xs text-secondary mt-1">
                      Try adjusting your search criteria, status filter, or time horizon.
                    </p>
                  </AdminFinanceSecurityDepositsEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((d) => {
                const netRefundable = Math.max(0, d.depositAmount - (d.deductionAmount || 0));

                return (
                  <tr
                    key={d.id}
                    className="hover:bg-surface-hover/70 transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                          {d.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                            <span>{d.studentName}</span>
                            <span className="font-mono text-[11px] font-semibold text-secondary">
                              ({d.smartId})
                            </span>
                          </div>
                          {d.phone && (
                            <div className="text-[11px] text-secondary mt-0.5">
                              +91 {d.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Seat & Branch */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-primary bg-surface-ground border border-border">
                          <Armchair size={12} className="text-secondary" />
                          <span>Seat {d.seat || 'N/A'}</span>
                        </div>
                        <div className="text-[11px] text-secondary flex items-center gap-1">
                          <Building size={11} />
                          <span>{d.branch || 'Downtown Central'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Deposit Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold font-sans text-primary text-sm">
                        ₹{d.depositAmount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          STATUS_BADGE[d.status] || 'bg-surface text-secondary border-border'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        <span>{STATUS_LABEL[d.status] || d.status}</span>
                      </span>
                    </td>

                    {/* Collected By */}
                    <td className="py-3.5 px-4">
                      <span className="text-secondary">{d.collectedBy}</span>
                    </td>

                    {/* Collected Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-secondary">
                        <Calendar size={12} />
                        <span>{d.collectedDate}</span>
                      </div>
                    </td>

                    {/* Deduction Amount & Reason */}
                    <td className="py-3.5 px-4 text-right">
                      {d.deductionAmount > 0 ? (
                        <div>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            - ₹{d.deductionAmount.toLocaleString('en-IN')}
                          </span>
                          {d.deductionReason && (
                            <div
                              className="text-[10px] text-secondary truncate max-w-[140px] ml-auto"
                              title={d.deductionReason}
                            >
                              {d.deductionReason}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                    </td>

                    {/* Refunded Date / Net */}
                    <td className="py-3.5 px-4">
                      {d.status === 'refunded' ? (
                        <div>
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Disbursed
                          </div>
                          <div className="text-[11px] text-secondary">
                            {d.refundedDate || 'Completed'}
                          </div>
                        </div>
                      ) : d.status === 'held' ? (
                        <div className="text-secondary">
                          Net: <strong className="text-primary font-bold">₹{netRefundable.toLocaleString('en-IN')}</strong>
                        </div>
                      ) : (
                        <span className="text-secondary text-[11px]">Retained</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {d.status === 'held' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenRefund(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-all active:scale-95"
                            title="Process Exit Clearance & Release Deposit"
                          >
                            <Undo2 size={12} />
                            <span>Refund</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDeduct(d)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-surface hover:bg-surface-hover border border-border text-primary cursor-pointer transition-all"
                            title="Log damage or penalty deduction"
                          >
                            <Minus size={12} className="text-rose-500" />
                            <span>Deduct</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-secondary text-[11px] italic">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary px-1">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="p-1 rounded-lg border border-border bg-input-bg text-primary text-xs cursor-pointer focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-secondary ml-2">
            Showing <strong className="text-primary">{startItem}</strong> - <strong className="text-primary">{endItem}</strong> of <strong className="text-primary">{totalRows}</strong> records
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-secondary">
            Page {effectivePage + 1} of {pageCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={effectivePage <= 0}
              onClick={onPrevPage}
              className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-primary transition-colors"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={effectivePage >= pageCount - 1}
              onClick={onNextPage}
              className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-primary transition-colors"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
