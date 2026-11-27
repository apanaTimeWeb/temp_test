'use client';

import {
  formatCollectFeeInr,
  getCollectFeeCurrencySymbol,
} from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { Layers } from 'lucide-react';

export interface CompositeLineItem {
  id: string;
  label: string;
  amount: number;
  enabled: boolean;
}

interface ManagerFinanceCollectFeeCompositeCardProps {
  compositeEnabled: boolean;
  compositeItems: CompositeLineItem[];
  onToggleEnabled: (checked: boolean) => void;
  onToggleItem: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
}

export default function ManagerFinanceCollectFeeCompositeCard({
  compositeEnabled,
  compositeItems,
  onToggleEnabled,
  onToggleItem,
  onUpdateAmount,
}: ManagerFinanceCollectFeeCompositeCardProps) {
  const currencySymbol = getCollectFeeCurrencySymbol();
  const enabledCount = compositeItems.filter((i) => i.enabled).length;
  const combinedTotal = compositeItems.filter((i) => i.enabled).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fin-card p-6 space-y-4 border border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-subtle text-primary">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Composite Billing (Multi-Item Receipt)</h3>
            <p className="text-xs text-secondary">Bundle seat fees, lockers, and late penalties into one combined receipt.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            data-testid="manager-finance-composite-toggle"
            checked={compositeEnabled}
            onChange={(e) => onToggleEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 motion-safe:after:transition-all peer-checked:bg-primary" />
        </label>
      </div>

      {compositeEnabled && (
        <div className="space-y-3 pt-3 border-t border-border/70 motion-safe:animate-in fade-in">
          <p className="text-xs font-semibold text-text-primary">Select items to include in this invoice:</p>
          <div className="space-y-2">
            {compositeItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border motion-safe:transition-all ${
                  item.enabled ? 'border-primary bg-primary-subtle shadow-xs' : 'border-border bg-card opacity-60'
                }`}
              >
                <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => onToggleItem(item.id)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className={`text-xs font-semibold ${item.enabled ? 'text-primary' : 'text-secondary'}`}>
                    {item.label}
                  </span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-secondary font-semibold">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={item.amount}
                    disabled={!item.enabled}
                    onChange={(e) => onUpdateAmount(item.id, Number(e.target.value) || 0)}
                    className="w-24 text-xs font-bold rounded-lg border border-border bg-surface px-2.5 py-1 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border text-xs font-bold text-primary">
            <span>Combined Total ({enabledCount} items):</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {formatCollectFeeInr(combinedTotal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
