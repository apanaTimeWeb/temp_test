'use client';

import React from 'react';
import type { ManagerFinanceCollectFeeDraft } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeDraftSchema';
import { STANDARD_CYCLE_AMOUNTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import { Calendar, Clock } from 'lucide-react';

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
  billingMonth?: string;
  onBillingMonthChange?: (val: string) => void;
  availableMonths?: Array<{ id: string; label: string }>;
  coverageLabel?: string;
  nextDueDateFormatted?: string;
  customMonthsError?: string;
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
  billingMonth,
  onBillingMonthChange,
  availableMonths = [],
  coverageLabel,
  nextDueDateFormatted,
  customMonthsError,
}: ManagerFinanceCollectFeeDurationSelectorProps) {
  return (
    <div className="space-y-3">
      {availableMonths.length > 0 && onBillingMonthChange && (
        <div>
          <label className="fin-label flex flex-wrap items-center justify-between gap-1" htmlFor="manager-collect-fee-billing-month">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={13} className="fin-icon-muted" />
              <span>Billing Month / Cycle Start</span>
              <span className="fin-text-danger">*</span>
            </span>
            <span className="text-xs text-secondary">Target payment cycle</span>
          </label>
          <select
            id="manager-collect-fee-billing-month"
            className="fin-select w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={billingMonth || ''}
            onChange={(e) => onBillingMonthChange(e.target.value)}
          >
            {availableMonths.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-128">
            {labelMonthPayingForCycle} <span className="fin-text-danger">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              if (isCustomDuration) {
                onToggleCustomDuration(false);
                onMonthsToRenewChange('1');
                onAmountChange(String(STANDARD_CYCLE_AMOUNTS['1']));
              } else {
                onToggleCustomDuration(true);
              }
            }}
            className="text-xs text-primary font-medium hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {isCustomDuration ? 'Standard Cycle' : '+ Custom Duration'}
          </button>
        </div>
        {!isCustomDuration ? (
          <select
            id="rbg4-managerfinancecollectfeepage-128"
            className="fin-select w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={monthsToRenew}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom') {
                onToggleCustomDuration(true);
              } else {
                onMonthsToRenewChange(val);
                const targetAmount = STANDARD_CYCLE_AMOUNTS[val] ?? (Number(val) > 0 ? Number(val) * 1200 : undefined);
                if (targetAmount !== undefined) {
                  onAmountChange(String(targetAmount));
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
          <div className="space-y-1 mt-1">
            <div className="flex gap-2 items-center">
              <input
                id="manager-collect-fee-custom-duration"
                name="customDurationMonths"
                type="number"
                min="1"
                max="36"
                className={`fin-input flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  customMonthsError ? 'border-danger' : ''
                }`}
                placeholder="Enter custom months (1 - 36)"
                value={monthsToRenew}
                onChange={(e) => {
                  const m = e.target.value;
                  onMonthsToRenewChange(m);
                  if (Number(m) > 0 && Number(m) <= 36) {
                    onAmountChange(String(Number(m) * 1200));
                  }
                }}
              />
              <span className="text-xs text-secondary font-medium px-2 shrink-0">Months</span>
            </div>
            {customMonthsError && (
              <p className="fin-input-hint fin-text-danger" role="alert">
                {customMonthsError}
              </p>
            )}
          </div>
        )}
      </div>

      {(coverageLabel || nextDueDateFormatted) && (
        <div className="bg-muted/40 border border-border/80 rounded-lg p-2.5 text-xs space-y-1.5">
          {coverageLabel && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
              <span className="text-secondary font-medium shrink-0">Billing Period:</span>
              <span className="font-semibold text-text-primary break-words text-left sm:text-right">{coverageLabel}</span>
            </div>
          )}
          {nextDueDateFormatted && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
              <span className="text-secondary font-medium flex items-center gap-1 shrink-0">
                <Clock size={11} className="text-primary" />
                <span>Next Due Date:</span>
              </span>
              <span className="font-semibold text-primary text-left sm:text-right">{nextDueDateFormatted}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

