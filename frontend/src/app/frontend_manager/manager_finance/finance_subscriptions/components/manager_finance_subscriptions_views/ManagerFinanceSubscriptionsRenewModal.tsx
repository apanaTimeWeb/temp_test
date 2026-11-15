'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, Calendar, CreditCard, User, Sparkles } from 'lucide-react';
import type { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';

export type SubscriptionRecord = (typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS)[0];

export interface ManagerFinanceSubscriptionsRenewModalProps {
  subscription: SubscriptionRecord | null;
  onClose: () => void;
  onRenewSuccess: (renewed: SubscriptionRecord, message: string) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const RENEWAL_DURATIONS = [
  { months: 1, label: '1 Month', discountPercent: 0 },
  { months: 3, label: '3 Months', discountPercent: 5, badge: '5% Off' },
  { months: 6, label: '6 Months', discountPercent: 10, badge: '10% Off' },
  { months: 12, label: '1 Year', discountPercent: 15, badge: '15% Off' },
];

const PAYMENT_MODES = ['UPI', 'Cash', 'Card', 'Bank Transfer'] as const;

function addMonthsToDate(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  const base = isNaN(d.getTime()) ? new Date() : d;
  const result = new Date(base.getTime());
  result.setMonth(result.getMonth() + months);
  return result.toISOString().split('T')[0];
}

export default function ManagerFinanceSubscriptionsRenewModal({
  subscription,
  onClose,
  onRenewSuccess,
  formatDate,
  formatCurrency,
}: ManagerFinanceSubscriptionsRenewModalProps) {
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [referenceNo, setReferenceNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!subscription) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subscription, onClose]);

  useEffect(() => {
    if (subscription) {
      setSelectedMonths(1);
      setPaymentMode('UPI');
      setReferenceNo(`RNW-${Date.now().toString().slice(-6)}`);
      setIsSubmitting(false);
    }
  }, [subscription]);

  if (!subscription) return null;

  // Calculate renewal cycle
  const isExpired = subscription.daysLeft <= 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const newStartDate = isExpired ? todayStr : subscription.endDate;
  const newEndDate = addMonthsToDate(newStartDate, selectedMonths);

  // Approximate days added
  const daysAdded = selectedMonths * 30;
  const calculatedDaysLeft = isExpired ? daysAdded : subscription.daysLeft + daysAdded;

  // Pricing calculation based on subscription plan base
  const selectedDuration = RENEWAL_DURATIONS.find((d) => d.months === selectedMonths) || RENEWAL_DURATIONS[0];
  const monthlyBaseMinor = subscription.plan.toLowerCase().includes('premium') ? 1500000 : 800000;
  const grossTotalMinor = monthlyBaseMinor * selectedMonths;
  const discountMinor = Math.round((grossTotalMinor * selectedDuration.discountPercent) / 100);
  const netTotalMinor = grossTotalMinor - discountMinor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const renewedRecord: SubscriptionRecord = {
      ...subscription,
      startDate: newStartDate,
      endDate: newEndDate,
      daysLeft: calculatedDaysLeft,
      base: grossTotalMinor,
      discount: discountMinor,
      total: netTotalMinor,
      paid: netTotalMinor,
      due: 0,
      status: 'active',
    };

    setTimeout(() => {
      onRenewSuccess(
        renewedRecord,
        `Subscription successfully renewed for ${subscription.studentName} for ${selectedDuration.label} until ${formatDate(newEndDate)}!`
      );
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="renew-subscription-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <RefreshCw size={16} />
              </div>
              <h3 id="renew-subscription-modal-title" className="text-lg font-bold text-primary">
                Renew Subscription Plan
              </h3>
            </div>
            <p className="text-xs text-secondary mt-1">
              Extend membership duration, apply discounts, and record renewal payment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              <User size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">{subscription.studentName}</h4>
              <p className="text-xs text-secondary font-mono">
                {subscription.smartId} • {subscription.plan} • {subscription.shift}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-secondary block">Current Expiry</span>
            <span className="text-xs font-semibold text-primary">
              {formatDate(subscription.endDate)}
            </span>
            <span className={`text-[10px] block font-medium ${isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
              {isExpired ? `Expired ${Math.abs(subscription.daysLeft)} days ago` : `${subscription.daysLeft} days remaining`}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duration Selector */}
          <div>
            <label className="text-xs font-semibold text-primary block mb-1.5">
              Select Renewal Duration <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RENEWAL_DURATIONS.map((dur) => {
                const isSelected = selectedMonths === dur.months;
                return (
                  <button
                    key={dur.months}
                    type="button"
                    onClick={() => setSelectedMonths(dur.months)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500'
                        : 'border-border bg-card hover:border-primary/50 text-secondary'
                    }`}
                  >
                    {dur.badge && (
                      <span className="absolute -top-2 right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                        {dur.badge}
                      </span>
                    )}
                    <span className="text-sm block">{dur.label}</span>
                    <span className="text-[10px] opacity-75 block">Valid for {dur.months * 30} days</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Cycle Dates Preview */}
          <div className="p-3 rounded-xl bg-floating border border-border grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-secondary flex items-center gap-1">
                <Calendar size={12} /> Renewal Start
              </span>
              <span className="font-semibold text-primary mt-0.5 block">{formatDate(newStartDate)}</span>
            </div>
            <div>
              <span className="text-secondary flex items-center gap-1">
                <Sparkles size={12} className="text-emerald-500" /> New Expiry Date
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {formatDate(newEndDate)}
              </span>
            </div>
          </div>

          {/* Payment Mode & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                Payment Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="mgr-input text-xs w-full cursor-pointer"
                required
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                Txn / Receipt Ref
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. UPI-992123"
                className="mgr-input text-xs w-full font-mono"
              />
            </div>
          </div>

          {/* Ledger Fee Breakdown */}
          <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5 text-xs">
            <div className="flex justify-between text-secondary">
              <span>Gross Renewal Fee ({selectedDuration.label}):</span>
              <span>{formatCurrency(grossTotalMinor)}</span>
            </div>
            {discountMinor > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount ({selectedDuration.discountPercent}% Off):</span>
                <span>- {formatCurrency(discountMinor)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-primary pt-2 border-t border-border">
              <span>Net Payable Amount:</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(netTotalMinor)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mgr-btn-ghost mgr-btn-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
            >
              <RefreshCw size={13} className={isSubmitting ? 'animate-spin' : ''} />
              {isSubmitting ? 'Processing...' : 'Confirm & Renew Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
