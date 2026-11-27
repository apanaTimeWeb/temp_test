'use client';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { CheckCircle2,Clock,Eye } from 'lucide-react';
import type { NativeCellParams, NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementNativeTable';

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
  onViewDetails?: (entry: Entry) => void;
}

export function createManagerAccountsDailySettlementColumns({
  labels,
  formatCurrency,
  onSettleShift,
  onViewDetails,
}: CreateDailySettlementColumnsOptions): NativeColumn<Entry>[] {
  return [
    {
      field: 'shift',
      headerName: labels.shift,
      flex: 1,
      minWidth: 170,
      cellRenderer: (p: NativeCellParams) => (
        <span className="font-bold text-primary text-xs">{p.value}</span>
      ),
    },
    {
      field: 'openingBalance',
      headerName: labels.opening,
      width: 120,
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
        <span className="text-emerald-400 font-bold text-xs font-mono">
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
        <span className="text-indigo-400 font-bold text-xs font-mono">
          {formatCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'expenses',
      headerName: labels.expenses,
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-rose-400 font-bold text-xs font-mono">
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
          <span className={isMissing ? 'text-secondary/50 italic text-xs' : 'text-secondary text-xs font-medium'}>
            {isMissing ? '—' : val}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: labels.status,
      width: 130,
      cellRenderer: (p: NativeCellParams) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            p.value === 'settled'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
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
      width: 160,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: NativeCellParams<Entry>) => {
        const entry = params.data;
        if (!entry) return null;
        const isPending = entry.status === 'pending';

        return (
          <div className="h-full flex justify-end items-center gap-1.5">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(entry)}
                className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 transition-colors cursor-pointer"
                title={`View ${entry.shift} audit details`}
                aria-label={`View audit details for ${entry.shift}`}
              >
                <Eye size={15} />
              </button>
            )}

            {isPending ? (
              <button
                type="button"
                onClick={() => onSettleShift(entry.shift)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title={`Settle shift ${entry.shift}`}
              >
                Settle Shift
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={12} /> Verified
              </span>
            )}
          </div>
        );
      },
    },
  ];
}
export default createManagerAccountsDailySettlementColumns;
