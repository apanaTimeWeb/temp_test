'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { formatSubscriptionInr } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsHelpers';
import { Calculator, CheckCircle2, TrendingUp, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export interface SubscriptionRecord {
  id: number;
  studentName: string;
  smartId: string;
  plan: string;
  shift: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  base: number;
  total: number;
  paid: number;
  due: number;
  status: string;
}

export interface ShiftPlanOption {
  id: string;
  name: string;
  shift: string;
  hours: number;
  monthlyRate: number;
}

export const SHIFT_PLAN_TIERS: ShiftPlanOption[] = [
  { id: 'shift-6h-morning', name: 'Morning Shift (6 Hours)', shift: 'Morning', hours: 6, monthlyRate: 800 },
  { id: 'shift-6h-evening', name: 'Evening Shift (6 Hours)', shift: 'Evening', hours: 6, monthlyRate: 800 },
  { id: 'shift-12h-fullday', name: 'Full Day Shift (12 Hours)', shift: 'Full Day', hours: 12, monthlyRate: 1500 },
  { id: 'shift-24h-unlimited', name: '24/7 Unlimited Access', shift: '24 Hours', hours: 24, monthlyRate: 2200 },
];

export interface ManagerFinanceSubscriptionsUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionRecord | null;
  onConfirmUpgrade: (id: number, newPlanName: string, newShift: string, netPayable: number) => void;
}

export default function ManagerFinanceSubscriptionsUpgradeModal({
  isOpen,
  onClose,
  subscription,
  onConfirmUpgrade,
}: ManagerFinanceSubscriptionsUpgradeModalProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('shift-12h-fullday');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !subscription) return null;

  const currentMonthlyRate = subscription.shift === 'Full Day' ? 1500 : 800;
  const targetOption = SHIFT_PLAN_TIERS.find((t) => t.id === selectedTargetId) || SHIFT_PLAN_TIERS[2];
  const remainingDays = Math.max(1, subscription.daysLeft > 0 ? subscription.daysLeft : 15);
  const cycleDays = 30;
  const currentDailyRate = currentMonthlyRate / cycleDays;
  const targetDailyRate = targetOption.monthlyRate / cycleDays;
  const unusedCredit = Math.round(remainingDays * currentDailyRate);
  const targetCostForRemainingDays = Math.round(remainingDays * targetDailyRate);
  const netProRataPayable = Math.max(0, targetCostForRemainingDays - unusedCredit);

  const handleUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onConfirmUpgrade(subscription.id, targetOption.name, targetOption.shift, netProRataPayable);
      toast.success(
        `Plan upgraded for ${subscription.studentName}: ${targetOption.name} activated! Pro-rata collected: ${formatSubscriptionInr(netProRataPayable)}`,
        { id: 'subscriptions-upgrade-success' }
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 motion-safe:animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-plan-title"
      data-testid="manager-finance-upgrade-modal"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 motion-safe:animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-subtle text-primary">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 id="upgrade-plan-title" className="text-base font-bold text-primary">
                Pro-Rata Plan Upgrade Calculator
              </h2>
              <p className="text-xs text-secondary">Mid-month shift &amp; plan upgrade with auto-adjusted remaining days.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpgrade} className="space-y-4">
          <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Student:</span>
              <span className="font-bold text-primary">
                {subscription.studentName} ({subscription.smartId})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Current Shift / Plan:</span>
              <span className="font-semibold text-primary">
                {subscription.shift} ({subscription.plan}) • {formatSubscriptionInr(currentMonthlyRate)}/mo
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Remaining Active Days:</span>
              <span className="font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">{remainingDays} Days remaining</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-primary block">Select Target Upgrade Shift:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SHIFT_PLAN_TIERS.map((tier) => {
                const isSelected = tier.id === selectedTargetId;
                const isSameShift = tier.shift === subscription.shift;
                return (
                  <button
                    type="button"
                    key={tier.id}
                    disabled={isSameShift}
                    onClick={() => setSelectedTargetId(tier.id)}
                    className={`p-3 rounded-xl border text-left motion-safe:transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary-subtle ring-2 ring-primary'
                        : isSameShift
                          ? 'border-border bg-muted/20 opacity-50 cursor-not-allowed'
                          : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{tier.shift}</span>
                      <span className="text-xs font-bold text-primary">{formatSubscriptionInr(tier.monthlyRate)}/mo</span>
                    </div>
                    <p className="text-[11px] text-secondary mt-0.5">{tier.hours} Hours Daily</p>
                    {isSameShift && <span className="text-[10px] text-secondary font-medium">(Current Plan)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-primary-subtle space-y-2.5 text-xs" data-testid="pro-rata-calculator-breakdown">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <Calculator size={15} />
              <span>Pro-Rata Adjustment Formula Breakdown</span>
            </div>
            <div className="space-y-1.5 pt-1 border-t border-border/60">
              <div className="flex justify-between text-secondary">
                <span>
                  Unused credit of current plan ({remainingDays} days @ {formatSubscriptionInr(currentDailyRate, 1)}/day):
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">- {formatSubscriptionInr(unusedCredit)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>
                  Cost of new plan ({remainingDays} days @ {formatSubscriptionInr(targetDailyRate, 1)}/day):
                </span>
                <span className="font-medium text-primary">+ {formatSubscriptionInr(targetCostForRemainingDays)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border text-sm font-black text-primary">
                <span>Net Upgrade Amount Payable:</span>
                <span className="text-base text-emerald-600 dark:text-emerald-400">{formatSubscriptionInr(netProRataPayable)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Payment Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'upi', 'card'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMode(m)}
                  className={`py-2 text-xs font-semibold rounded-lg border text-center uppercase motion-safe:transition-colors ${
                    paymentMode === m ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || targetOption.shift === subscription.shift}
              data-testid="confirm-pro-rata-upgrade-btn"
              className="mgr-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <ButtonLoader icon="repeat" /> : <CheckCircle2 size={14} />}
              <span>{isSubmitting ? 'Upgrading...' : `Confirm Plan Upgrade (${formatSubscriptionInr(netProRataPayable)})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
