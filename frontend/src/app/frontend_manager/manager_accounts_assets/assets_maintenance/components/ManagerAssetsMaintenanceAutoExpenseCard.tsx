'use client';

import { formatMaintenanceInrRupees } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/utils/ManagerAssetsMaintenanceExportHelpers';

interface ManagerAssetsMaintenanceAutoExpenseCardProps {
  costValue: number;
  autoPostToExpenses: boolean;
  setAutoPostToExpenses: (checked: boolean) => void;
  expensePaymentSource: 'petty_cash' | 'bank_direct';
  setExpensePaymentSource: (src: 'petty_cash' | 'bank_direct') => void;
}

export function ManagerAssetsMaintenanceAutoExpenseCard({
  costValue,
  autoPostToExpenses,
  setAutoPostToExpenses,
  expensePaymentSource,
  setExpensePaymentSource,
}: ManagerAssetsMaintenanceAutoExpenseCardProps) {
  if (costValue <= 0) return null;

  return (
    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-emerald-300 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPostToExpenses}
            onChange={(e) => setAutoPostToExpenses(e.target.checked)}
            className="rounded border-border text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
          />
          <span>Auto-Post to Operating Expenses</span>
        </label>
        <span className="text-xs text-emerald-300 font-mono font-bold">{formatMaintenanceInrRupees(costValue)}</span>
      </div>
      <p className="text-[11px] text-emerald-200 opacity-80 leading-relaxed pl-6">
        Automatically logs a &quot;Maintenance&quot; expense voucher into Operating Expenses so repair costs are never omitted from accounts ledger.
      </p>
      {autoPostToExpenses && (
        <div className="pl-6 pt-1 flex items-center gap-2 text-xs flex-wrap">
          <span className="text-[11px] text-secondary font-medium">Expense Fund Source:</span>
          <button
            type="button"
            onClick={() => setExpensePaymentSource('petty_cash')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border motion-safe:transition-all cursor-pointer ${
              expensePaymentSource === 'petty_cash' ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-xs' : 'bg-card text-secondary border-border'
            }`}
          >
            Petty Cash Float
          </button>
          <button
            type="button"
            onClick={() => setExpensePaymentSource('bank_direct')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border motion-safe:transition-all cursor-pointer ${
              expensePaymentSource === 'bank_direct' ? 'bg-sky-500/25 text-sky-300 border-sky-500/40 shadow-xs' : 'bg-card text-secondary border-border'
            }`}
          >
            Bank / Owner Direct
          </button>
        </div>
      )}
    </div>
  );
}
