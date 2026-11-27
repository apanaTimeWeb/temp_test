'use client';

import ManagerFinanceCollectFeeDurationSelector from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeDurationSelector';
import {
  MANAGER_FINANCE_COLLECTION_TYPES,
  STANDARD_CYCLE_AMOUNTS,
  type ManagerFinanceCollectionType,
} from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import type { ManagerFinanceCollectFeeStudent } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { formatCollectFeeInr } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { AlertCircle, Archive, Calendar, CheckCircle, PieChart, Scale } from 'lucide-react';

interface ManagerFinanceCollectFeeCollectionTypeCardProps {
  selectedStudent: ManagerFinanceCollectFeeStudent | null;
  collectionType: ManagerFinanceCollectionType;
  monthsToRenew: string;
  amount: string;
  studentDueMajor: number;
  studentDuePaise: number;
  targetReconciliationAmount: number;
  isCustomDuration: boolean;
  billingMonth: string;
  availableMonths: Array<{ id: string; label: string }>;
  coverageLabel: string;
  nextDueDateFormatted: string;
  customMonthsError?: string;
  formatCurrency: (n: number) => string;
  labels: {
    monthPayingForCycle: string;
    label1Month: string;
    label3MonthsQuarterly: string;
    label6MonthsHalfYearly: string;
    label12MonthsAnnual: string;
  };
  onApplyCollectionType: (type: ManagerFinanceCollectionType) => void;
  onToggleCustomDuration: (custom: boolean) => void;
  onDurationChange: (val: string) => void;
  onSetAmount: (val: string) => void;
  onSetBillingMonth: (val: string) => void;
}

export default function ManagerFinanceCollectFeeCollectionTypeCard({
  selectedStudent,
  collectionType,
  monthsToRenew,
  amount,
  studentDueMajor,
  studentDuePaise,
  targetReconciliationAmount,
  isCustomDuration,
  billingMonth,
  availableMonths,
  coverageLabel,
  nextDueDateFormatted,
  customMonthsError,
  formatCurrency,
  labels,
  onApplyCollectionType,
  onToggleCustomDuration,
  onDurationChange,
  onSetAmount,
  onSetBillingMonth,
}: ManagerFinanceCollectFeeCollectionTypeCardProps) {
  const quickChips = [500, 1000, 1500, Math.round(targetReconciliationAmount / 2)].filter(
    (v, idx, arr) => v > 0 && arr.indexOf(v) === idx
  );

  return (
    <div className="fin-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="fin-section-label">What are you collecting today?</p>
        {selectedStudent && (
          <span className="text-xs text-primary font-medium">Auto-fetch active for {selectedStudent.name}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Collection Option">
        {MANAGER_FINANCE_COLLECTION_TYPES.map((opt) => {
          const isSelected = collectionType === opt.id;
          const isDuesOption = opt.id === 'dues';
          const studentHasDues = Boolean(selectedStudent && selectedStudent.dueAmount > 0);
          return (
            <button
              type="button"
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onApplyCollectionType(opt.id)}
              className={`p-3 rounded-xl border text-left motion-safe:transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected ? 'border-primary bg-primary-subtle shadow-sm ring-1 ring-primary' : 'border-border bg-card hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                  {opt.label}
                </span>
                {isDuesOption && studentHasDues && (
                  <span className="fin-badge fin-badge--danger text-[9px] px-1 py-0">
                    {formatCollectFeeInr(studentDueMajor)}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-secondary mt-1 leading-snug">{opt.description}</div>
            </button>
          );
        })}
      </div>

      <div className="text-xs p-3 rounded-lg border bg-muted/30 border-border space-y-1">
        {collectionType === 'dues' &&
          (studentDueMajor > 0 ? (
            <div className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle size={14} className="shrink-0" />
              <span>
                Auto-fetched Full Due: <strong>{formatCurrency(studentDuePaise)}</strong> has been populated in the amount field to settle all past dues.
              </span>
            </div>
          ) : (
            <div className="text-secondary flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0 text-amber-500" />
              <span>
                Student has <strong>{formatCollectFeeInr(0, true)} outstanding dues</strong>. Selecting <strong>Monthly Fee (Renewal)</strong> or <strong>Late Fine</strong> is recommended.
              </span>
            </div>
          ))}

        {collectionType === 'monthly' && (
          <div className="space-y-1">
            <div className="text-text-primary font-medium flex items-center gap-1.5">
              <Calendar size={14} className="shrink-0 text-primary" />
              <span>
                Auto-fetched Plan Cycle Rate: <strong>{formatCollectFeeInr(STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200)}</strong> for {monthsToRenew} Month(s).
              </span>
            </div>
            {studentDueMajor > 0 && (
              <div className="flex items-center justify-between text-danger font-medium pt-1 border-t border-border/60">
                <span>Student also has {formatCurrency(studentDuePaise)} previous dues.</span>
                <button
                  type="button"
                  onClick={() => onSetAmount(String((STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200) + studentDueMajor))}
                  className="underline hover:opacity-80 text-xs font-semibold cursor-pointer"
                >
                  {`+ Add Past Dues (+${formatCollectFeeInr(studentDueMajor)})`}
                </button>
              </div>
            )}
          </div>
        )}

        {collectionType === 'fine' && (
          <div className="text-text-primary font-medium flex items-center gap-1.5">
            <Scale size={14} className="shrink-0 text-amber-500" />
            <span>
              Auto-fetched Overdue Fine: <strong>{formatCollectFeeInr(200, true)}</strong>. This records late fee clearance only and will not extend desk validity.
            </span>
          </div>
        )}

        {collectionType === 'partial' && (
          <div className="space-y-2">
            <div className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <PieChart size={14} className="shrink-0" />
              <span>Partial Payment Mode Active: Settle part of the target amount (Target: {formatCollectFeeInr(targetReconciliationAmount)}).</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-secondary">Quick amounts:</span>
              {quickChips.map((chipVal) => (
                <button
                  type="button"
                  key={`chip-${chipVal}`}
                  onClick={() => onSetAmount(String(chipVal))}
                  className={`text-xs px-2 py-0.5 rounded border motion-safe:transition-colors cursor-pointer ${
                    amount === String(chipVal)
                      ? 'bg-primary text-on-primary font-semibold border-primary'
                      : 'bg-card border-border hover:bg-muted text-text-primary'
                  }`}
                >
                  {formatCollectFeeInr(chipVal)}
                </button>
              ))}
            </div>
          </div>
        )}

        {collectionType === 'locker' && (
          <div className="text-text-primary font-medium flex items-center gap-1.5">
            <Archive size={14} className="shrink-0 text-purple-500" />
            <span>
              Auto-fetched Locker Fee: <strong>{formatCollectFeeInr(400, true)}</strong> for monthly locker allocation.
            </span>
          </div>
        )}
      </div>

      {(collectionType === 'monthly' || collectionType === 'locker') && (
        <div className="pt-2 border-t border-border/70">
          <ManagerFinanceCollectFeeDurationSelector
            isCustomDuration={isCustomDuration}
            onToggleCustomDuration={onToggleCustomDuration}
            monthsToRenew={monthsToRenew}
            onMonthsToRenewChange={onDurationChange}
            onAmountChange={onSetAmount}
            labelMonthPayingForCycle={labels.monthPayingForCycle}
            label1Month={labels.label1Month}
            label3MonthsQuarterly={labels.label3MonthsQuarterly}
            label6MonthsHalfYearly={labels.label6MonthsHalfYearly}
            label12MonthsAnnual={labels.label12MonthsAnnual}
            billingMonth={billingMonth}
            onBillingMonthChange={onSetBillingMonth}
            availableMonths={availableMonths}
            coverageLabel={coverageLabel}
            nextDueDateFormatted={nextDueDateFormatted}
            customMonthsError={customMonthsError}
          />
        </div>
      )}
    </div>
  );
}
