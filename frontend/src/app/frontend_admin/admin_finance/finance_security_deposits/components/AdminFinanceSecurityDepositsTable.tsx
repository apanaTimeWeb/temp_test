'use client';

import { AdminFinanceSecurityDepositsEmptyState } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsEmptyState';
import type {
  AdminFinanceSecurityDeposit,
  DepositSortField,
} from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import { formatAdminFinanceSecurityDepositsCurrency } from '@/app/frontend_admin/admin_finance/finance_security_deposits/utils/formatAdminFinanceSecurityDepositsCurrency';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import {
  AlertTriangle, Armchair, ArrowDown, ArrowUp, ArrowUpDown,
  Building, Calendar, Minus, ShieldCheck, Undo2,
} from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  held: 'bg-primary-subtle text-primary border-border-focus',
  refunded: 'bg-success-bg text-success-text border-success',
  forfeited: 'bg-danger-bg text-danger-text border-danger',
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
  paginated,
  sortField,
  sortDirection,
  onToggleSort,
  onOpenRefund,
  onOpenDeduct,
  totalRows,
  pageSize,
  onPageSizeChange,
  effectivePage,
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
        className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-text-secondary ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 motion-safe:transition-colors cursor-pointer ${
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
            <ArrowUpDown
              size={13}
              className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[950px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-highlight">
              {renderSortableHeader('studentName', labels.student, 'left')}
              <th scope="col" className="text-left py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-text-secondary">
                {labels.seatBranch}
              </th>
              {renderSortableHeader('depositAmount', labels.deposit, 'right')}
              {renderSortableHeader('status', labels.status, 'left')}
              {renderSortableHeader('collectedBy', labels.collectedBy, 'left')}
              {renderSortableHeader('collectedDate', labels.collectedDate, 'left')}
              {renderSortableHeader('deductionAmount', labels.deduction, 'right')}
              {renderSortableHeader('refundedDate', labels.refundedDate, 'left')}
              <th scope="col" className="text-right py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-text-secondary">
                {labels.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card text-xs">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12">
                  <AdminFinanceSecurityDepositsEmptyState>
                    <div className="p-3 rounded-full bg-surface-highlight border border-border w-12 h-12 flex items-center justify-center mx-auto mb-3 text-text-secondary">
                      <AlertTriangle size={20} aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-text-primary">{labels.noDeposits}</p>
                    <p className="text-xs text-text-secondary mt-1">
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
                    className="motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary border border-border-focus flex items-center justify-center shrink-0 font-bold text-xs">
                          {d.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-text-primary flex items-center gap-2">
                            <span>{d.studentName}</span>
                            <span className="font-mono text-[11px] font-semibold text-text-secondary">
                              ({d.smartId})
                            </span>
                          </div>
                          {d.phone && <div className="text-[11px] text-text-secondary mt-0.5">+91 {d.phone}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-text-primary bg-surface-highlight border border-border">
                          <Armchair size={12} className="text-text-secondary" aria-hidden="true" />
                          <span>Seat {d.seat || 'N/A'}</span>
                        </div>
                        <div className="text-[11px] text-text-secondary flex items-center gap-1">
                          <Building size={11} aria-hidden="true" />
                          <span>{d.branch || 'Downtown Central'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold font-sans text-text-primary text-sm">
                        {formatAdminFinanceSecurityDepositsCurrency(d.depositAmount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          STATUS_BADGE[d.status] || 'bg-card text-text-secondary border-border'
                        }`}
                      >
                        <ShieldCheck size={12} aria-hidden="true" />
                        <span>{STATUS_LABEL[d.status] || d.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-text-secondary">{d.collectedBy}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Calendar size={12} aria-hidden="true" />
                        <span>{d.collectedDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {d.deductionAmount > 0 ? (
                        <div>
                          <span className="font-bold text-danger-text">
                            - {formatAdminFinanceSecurityDepositsCurrency(d.deductionAmount)}
                          </span>
                          {d.deductionReason && (
                            <div
                              className="text-[10px] text-text-secondary truncate max-w-[140px] ml-auto"
                              title={d.deductionReason}
                            >
                              {d.deductionReason}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {d.status === 'refunded' ? (
                        <div>
                          <div className="font-semibold text-success-text">Disbursed</div>
                          <div className="text-[11px] text-text-secondary">{d.refundedDate || 'Completed'}</div>
                        </div>
                      ) : d.status === 'held' ? (
                        <div className="text-text-secondary">
                          Net: <strong className="text-text-primary font-bold">{formatAdminFinanceSecurityDepositsCurrency(netRefundable)}</strong>
                        </div>
                      ) : (
                        <span className="text-text-secondary text-[11px]">Retained</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {d.status === 'held' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenRefund(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-success text-on-primary hover:opacity-90 shadow-card cursor-pointer motion-safe:transition-transform motion-safe:active:scale-95"
                            title="Process Exit Clearance & Release Deposit"
                          >
                            <Undo2 size={12} aria-hidden="true" />
                            <span>Refund</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDeduct(d)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-card hover:bg-surface-hover border border-border text-text-primary cursor-pointer motion-safe:transition-colors"
                            title="Log damage or penalty deduction"
                          >
                            <Minus size={12} className="text-danger-text" aria-hidden="true" />
                            <span>Deduct</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-text-secondary text-[11px] italic">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AdminTablePagination
        page={effectivePage}
        pageSize={pageSize}
        totalRows={totalRows}
        pageSizeOptions={[5, 10, 20, 50]}
        onPageChange={(nextPage) => {
          if (nextPage < effectivePage) onPrevPage();
          else if (nextPage > effectivePage) onNextPage();
        }}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
export default AdminFinanceSecurityDepositsTable;
