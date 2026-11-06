'use client';

import React from 'react';
import { Undo2, Minus } from 'lucide-react';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { ManagerFinanceSecurityDepositsEmptyState } from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_empty_states/ManagerFinanceSecurityDepositsEmptyState';

const STATUS_BADGE: Record<string, string> = {
  held: 'fin-badge fin-badge--info',
  refunded: 'fin-badge fin-badge--success',
  forfeited: 'fin-badge fin-badge--danger',
};

export interface ManagerFinanceSecurityDepositsTableProps {
  filtered: ManagerFinanceSecurityDepositsSampleDeposit[];
  paginated: ManagerFinanceSecurityDepositsSampleDeposit[];
  formatCurrency: (n: number) => string;
  renderSortableHeader: (field: 'studentName' | 'depositAmount' | 'status' | 'collectedBy' | 'collectedDate' | 'deductionAmount' | 'refundedDate', label: string, align?: 'left' | 'right') => React.ReactNode;
  onOpenRefund: (d: ManagerFinanceSecurityDepositsSampleDeposit) => void;
  onOpenDeduct: (d: ManagerFinanceSecurityDepositsSampleDeposit) => void;
  startItem: number;
  endItem: number;
  totalRows: number;
  effectivePage: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  labels: {
    student: string;
    depositInr: string;
    status: string;
    collectedBy: string;
    collectedDate: string;
    deductionInr: string;
    deductionReason: string;
    refundedDate: string;
    actions: string;
    noDeposits: string;
  };
  translateStatus: (s: string) => string;
}

export default function ManagerFinanceSecurityDepositsTable({
  filtered,
  paginated,
  formatCurrency,
  renderSortableHeader,
  onOpenRefund,
  onOpenDeduct,
  startItem,
  endItem,
  totalRows,
  effectivePage,
  pageCount,
  onPrevPage,
  onNextPage,
  labels,
  translateStatus,
}: ManagerFinanceSecurityDepositsTableProps) {
  return (
    <div className="fin-card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            {renderSortableHeader('studentName', labels.student, 'left')}
            {renderSortableHeader('depositAmount', labels.depositInr, 'right')}
            {renderSortableHeader('status', labels.status, 'left')}
            {renderSortableHeader('collectedBy', labels.collectedBy, 'left')}
            {renderSortableHeader('collectedDate', labels.collectedDate, 'left')}
            {renderSortableHeader('deductionAmount', labels.deductionInr, 'right')}
            <th scope="col" className="text-left py-3 px-4">{labels.deductionReason}</th>
            {renderSortableHeader('refundedDate', labels.refundedDate, 'left')}
            <th scope="col" className="text-right py-3 px-4">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <ManagerFinanceSecurityDepositsEmptyState className="fin-empty-state">
                  <div className="fin-empty-state__icon">🔒</div>
                  <p className="fin-empty-state__title">{labels.noDeposits}</p>
                </ManagerFinanceSecurityDepositsEmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((d) => (
              <tr
                key={d.id}
                className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra h-12"
              >
                <td className="py-3 px-4">
                  <div className="fin-cell-name font-semibold">{d.studentName}</div>
                  <div className="fin-cell-subtext font-mono">{d.smartId}</div>
                </td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(d.depositAmount)}</td>
                <td className="py-3 px-4">
                  <span className={STATUS_BADGE[d.status] || 'fin-badge fin-badge--neutral'}>{translateStatus(d.status)}</span>
                </td>
                <td className="py-3 px-4 fin-text-body">{d.collectedBy}</td>
                <td className="py-3 px-4 fin-cell-subtext">{d.collectedDate}</td>
                <td className={`py-3 px-4 text-right font-medium ${d.deductionAmount > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                  {d.deductionAmount > 0 ? formatCurrency(d.deductionAmount) : '—'}
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{d.deductionReason || '—'}</td>
                <td className="py-3 px-4 fin-cell-subtext">{d.refundedDate || '—'}</td>
                <td className="py-3 px-4">
                  {d.status === 'held' && (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenRefund(d)}
                        className="fin-badge fin-badge--success cursor-pointer hover:opacity-90 flex items-center gap-1"
                        title="Process deposit return to student"
                      >
                        <Undo2 size={11} /> Refund
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDeduct(d)}
                        className="fin-badge fin-badge--warning cursor-pointer hover:opacity-90 flex items-center gap-1"
                        title="Add penalty or damage deduction"
                      >
                        <Minus size={11} /> Deduct
                      </button>
                    </div>
                  )}
                  {d.status === 'refunded' && (
                    <span className="fin-cell-subtext text-success font-medium">✓ Refunded {d.refundedDate}</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
          <span>
            Showing {startItem}–{endItem} of {totalRows} deposit records
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={effectivePage === 0}
              onClick={onPrevPage}
              className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs">
              Page {effectivePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={effectivePage >= pageCount - 1}
              onClick={onNextPage}
              className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

