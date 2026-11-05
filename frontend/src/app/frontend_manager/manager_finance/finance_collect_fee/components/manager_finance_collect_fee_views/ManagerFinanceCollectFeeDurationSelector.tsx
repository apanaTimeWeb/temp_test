'use client';

import React from 'react';
import type { ManagerFinanceCollectFeeDraft } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeDraftSchema';

export interface ManagerFinanceCollectFeeDurationSelectorProps {
  isCustomDuration: boolean;
  onToggleCustomDuration: (custom: boolean) => void;
  monthsToRenew: ManagerFinanceCollectFeeDraft['monthsToRenew'];
  onMonthsToRenewChange: (val: string) => void;
  onAmountChange: (amount: string) => void;
  labelMonthPayingForCycle: string;
  label1Month: string;
  label3MonthsQuarterly: string;
  label6MonthsHalfYearly: string;
  label12MonthsAnnual: string;
}

export default function ManagerFinanceCollectFeeDurationSelector({
  isCustomDuration,
  onToggleCustomDuration,
  monthsToRenew,
  onMonthsToRenewChange,
  onAmountChange,
  labelMonthPayingForCycle,
  label1Month,
  label3MonthsQuarterly,
  label6MonthsHalfYearly,
  label12MonthsAnnual,
}: ManagerFinanceCollectFeeDurationSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-128">{labelMonthPayingForCycle}</label>
        <button
          type="button"
          onClick={() => {
            if (isCustomDuration) {
              onToggleCustomDuration(false);
              onMonthsToRenewChange('1');
            } else {
              onToggleCustomDuration(true);
            }
          }}
          className="text-xs text-primary font-medium hover:underline cursor-pointer"
        >
          {isCustomDuration ? 'Standard Cycle' : '+ Custom Duration'}
        </button>
      </div>
      {!isCustomDuration ? (
        <select
          id="rbg4-managerfinancecollectfeepage-128"
          className="fin-select w-full mt-1"
          value={monthsToRenew}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'custom') {
              onToggleCustomDuration(true);
            } else {
              onMonthsToRenewChange(val);
              if (Number(val) > 0) {
                onAmountChange(String(Number(val) * 1200));
              }
            }
          }}
        >
          <option value="1">{label1Month} (₹1,200)</option>
          <option value="3">{label3MonthsQuarterly} (₹3,400)</option>
          <option value="6">{label6MonthsHalfYearly} (₹6,500)</option>
          <option value="12">{label12MonthsAnnual} (₹12,000)</option>
          <option value="custom">Custom Duration / Months...</option>
        </select>
      ) : (
        <div className="flex gap-2 mt-1 items-center">
          <input
            type="number"
            min="1"
            max="36"
            className="fin-input flex-1"
            placeholder="Enter custom months (e.g. 2, 4, 8, 18)"
            value={monthsToRenew}
            onChange={(e) => {
              const m = e.target.value;
              onMonthsToRenewChange(m);
              if (Number(m) > 0) {
                onAmountChange(String(Number(m) * 1200));
              }
            }}
          />
          <span className="text-xs text-secondary font-medium px-2 shrink-0">Months</span>
        </div>
      )}
    </div>
  );
}

