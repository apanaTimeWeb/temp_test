'use client';

import React from 'react';
import { RotateCcw, Send, UserX, Clock } from 'lucide-react';
import type { NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_table_parts/ManagerFinanceRenewalsNativeTable';

export interface BuildRenewalColumnsParams {
  tManagerUi: (k: string, opts?: { count?: number }) => string;
  translateShift: (val: string) => string;
  translatePlanTier: (val: string) => string;
  formatDate: (val: string) => string;
  formatCurrency: (val: number) => string;
  onRenewStudent: (id: number | string, studentName: string) => void;
  onRemindStudent: (studentName: string) => void;
  onReleaseSeat?: (id: number | string, studentName: string) => void;
}

export function buildRenewalColumns({
  tManagerUi,
  translateShift,
  translatePlanTier,
  formatDate,
  formatCurrency,
  onRenewStudent,
  onRemindStudent,
  onReleaseSeat,
}: BuildRenewalColumnsParams) {
  return [
    { field: 'studentName', headerName: tManagerUi('student'), flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { field: 'smartId', headerName: tManagerUi('smart_id'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="fin-mono text-sm">{p.value}</span> },
    { field: 'shift', headerName: tManagerUi('shift'), width: 110, cellRenderer: (p: NativeCellParams) => <div className="h-full flex items-center"><span className="fin-badge fin-badge--neutral">{typeof p.value === 'string' ? translateShift(p.value) : '—'}</span></div> },
    { field: 'plan', headerName: tManagerUi('plan'), width: 110, cellRenderer: (p: NativeCellParams) => <span className="fin-text-body">{typeof p.value === 'string' ? translatePlanTier(p.value) : '—'}</span> },
    { field: 'expiryDate', headerName: tManagerUi('expiry_date'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{typeof p.value === 'string' ? formatDate(p.value) : p.value}</span> },
    {
      field: 'daysLeft',
      headerName: tManagerUi('days_left'),
      width: 140,
      cellRenderer: (p: NativeCellParams) => {
        const daysLeft = typeof p.value === 'number' ? p.value : 0;
        const row = p.data as { isSeatReleased?: boolean };
        if (row?.isSeatReleased) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary">
              ✓ Seat Vacated
            </span>
          );
        }
        if (daysLeft < 0) {
          const isOverduePastGrace = daysLeft < -3;
          return (
            <div className="flex flex-col text-left">
              <span className="fin-text-danger font-semibold">
                {tManagerUi('days_ago_count', { count: Math.abs(daysLeft) })}
              </span>
              <span className={`text-[10px] font-bold ${isOverduePastGrace ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isOverduePastGrace ? 'Release Timer: Overdue' : `Grace: ${3 + daysLeft}d left`}
              </span>
            </div>
          );
        }
        return (
          <span className={daysLeft <= 7 ? 'fin-text-warning font-semibold' : 'fin-text-body'}>
            {tManagerUi('days_count', { count: daysLeft })}
          </span>
        );
      },
    },
    { field: 'lastPaymentDate', headerName: tManagerUi('last_payment'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{typeof p.value === 'string' ? formatDate(p.value) : p.value}</span> },
    {
      field: 'due',
      headerName: tManagerUi('due_inr'),
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: NativeCellParams) => {
        const due = typeof p.value === 'number' ? p.value : 0;
        return <span className={due > 0 ? 'fin-text-danger' : 'fin-text-body'}>{formatCurrency(due)}</span>;
      },
    },
    {
      headerName: tManagerUi('actions'),
      width: 240,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as { id: number | string; studentName: string; daysLeft: number; isSeatReleased?: boolean };
        const isEligibleForRelease = row.daysLeft < -3 && !row.isSeatReleased;
        return (
          <div className="flex items-center gap-1.5 h-full flex-wrap">
            <button
              type="button"
              onClick={() => onRenewStudent(row.id, row.studentName)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              title={`Renew subscription for ${row.studentName}`}
            >
              <RotateCcw size={12} /> Renew
            </button>
            <button
              type="button"
              onClick={() => onRemindStudent(row.studentName)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-border bg-card hover:bg-surface-hover text-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title={`Send reminder to ${row.studentName}`}
            >
              <Send size={12} className="text-amber-500" /> Remind
            </button>
            {isEligibleForRelease && onReleaseSeat && (
              <button
                type="button"
                data-testid={`release-seat-btn-${row.id}`}
                onClick={() => onReleaseSeat(row.id, row.studentName)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
                title={`Release seat for ${row.studentName} due to grace period expiration`}
              >
                <UserX size={12} /> Release Seat
              </button>
            )}
          </div>
        );
      },
    },
  ];
}

