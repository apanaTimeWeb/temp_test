'use client';
import { CheckCircle2, Clock } from 'lucide-react';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import type { NativeColumn, NativeCellParams } from './ManagerAccountsDailySettlementNativeTable';

interface CreateDailySettlementColumnsOptions {
  labels: {
    shift: string;
    opening: string;
    cash: string;
    upi: string;
    expenses: string;
    closing: string;
    settledBy: string;
    status: string;
    completed: string;
    pending: string;
    action: string;
  };
  formatCurrency: (val: number) => string;
  onSettleShift: (shiftName: string) => void;
}

export function createManagerAccountsDailySettlementColumns({
  labels,
  formatCurrency,
  onSettleShift,
}: CreateDailySettlementColumnsOptions): NativeColumn<Entry>[] {
  return [
    {
      field: 'shift',
      headerName: labels.shift,
      flex: 1,
      minWidth: 180,
      cellRenderer: (p: NativeCellParams) => (
        <span className="font-semibold text-primary text-xs">{p.value}</span>
      ),
    },
    {
      field: 'openingBalance',
      headerName: labels.opening,
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-secondary text-xs font-mono">
          {formatCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'cashCollected',
      headerName: labels.cash,
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-success font-bold text-xs font-mono">
          {formatCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'upiCollected',
      headerName: labels.upi,
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-primary font-bold text-xs font-mono">
          {formatCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'expenses',
      headerName: labels.expenses,
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-danger font-bold text-xs font-mono">
          {formatCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'closingBalance',
      headerName: labels.closing,
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-primary font-black text-xs font-mono">
          {formatCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'settledBy',
      headerName: labels.settledBy,
      width: 150,
      cellRenderer: (p: NativeCellParams) => {
        const val = typeof p.value === 'string' ? p.value.trim() : '';
        const isMissing = !val || val === '—' || val === '-';
        return (
          <span className={isMissing ? 'text-secondary/50 italic text-xs' : 'text-secondary text-xs'}>
            {isMissing ? '—' : val}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: labels.status,
      width: 120,
      cellRenderer: (p: NativeCellParams) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            p.value === 'settled'
              ? 'bg-success-bg text-success border border-border'
              : 'bg-warning-bg text-warning border border-border'
          }`}
        >
          {p.value === 'settled' ? (
            <>
              <CheckCircle2 size={12} aria-hidden="true" />
              <span>{labels.completed}</span>
            </>
          ) : (
            <>
              <Clock size={12} aria-hidden="true" />
              <span>{p.value === 'pending' ? labels.pending : labels.status}</span>
            </>
          )}
        </span>
      ),
    },
    {
      headerName: labels.action,
      width: 130,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: NativeCellParams<Entry>) => {
        if (params.data?.status === 'pending') {
          const shiftName = params.data.shift;
          return (
            <div className="h-full flex justify-end items-center">
              <button
                type="button"
                onClick={() => onSettleShift(shiftName)}
                className="px-2.5 py-1 rounded-lg bg-success hover:opacity-90 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                title={`Settle shift ${shiftName}`}
              >
                Settle Shift
              </button>
            </div>
          );
        }
        return (
          <div className="h-full flex justify-end items-center">
            <span className="inline-flex items-center gap-1 text-xs text-success font-semibold">
              <CheckCircle2 size={13} /> Verified
            </span>
          </div>
        );
      },
    },
  ];
}

