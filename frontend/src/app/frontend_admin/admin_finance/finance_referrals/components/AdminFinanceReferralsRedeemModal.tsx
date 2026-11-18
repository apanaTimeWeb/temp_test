'use client';

import React, { useState, useEffect } from 'react';
import { X, IndianRupee, CheckCircle2, CreditCard, Sparkles, AlertCircle, FileText, Gift } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';

interface AdminFinanceReferralsRedeemModalProps {
  referrer: AdminFinanceDemoReferrer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRedeem: (referrerId: number, amountMinor: number, mode: 'fee_adjustment' | 'cash_upi', notes: string) => void;
}

export function AdminFinanceReferralsRedeemModal({
  referrer,
  isOpen,
  onClose,
  onConfirmRedeem,
}: AdminFinanceReferralsRedeemModalProps) {
  const [mode, setMode] = useState<'fee_adjustment' | 'cash_upi'>('fee_adjustment');
  const [amountRupees, setAmountRupees] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (referrer) {
      // Balance is in minor units (e.g. 20000 = ₹200)
      const maxRupees = Math.round(referrer.balance / 100);
      setAmountRupees(maxRupees);
      setNotes(mode === 'fee_adjustment' ? 'Adjusted against next month desk subscription' : 'Direct reward disbursement');
      setError(null);
    }
  }, [referrer, mode]);

  if (!isOpen || !referrer) return null;

  const maxBalanceRupees = Math.round(referrer.balance / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountRupees <= 0) {
      setError('Please enter a valid redemption amount greater than ₹0.');
      return;
    }
    if (amountRupees > maxBalanceRupees) {
      setError(`Amount cannot exceed the available balance of ₹${maxBalanceRupees}.`);
      return;
    }

    const amountMinor = amountRupees * 100;
    onConfirmRedeem(referrer.id, amountMinor, mode, notes);
    toast.success(
      `Disbursed ₹${amountRupees.toLocaleString('en-IN')} referral bonus for ${referrer.name} (${mode === 'fee_adjustment' ? 'Adjusted in Desk Fee' : 'Disbursed via Cash/UPI'})`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="redeem-bonus-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs">
                  <Gift className="h-3.5 w-3.5" />
                  Referral Reward Clearance
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-100">
                  {referrer.branch ?? 'Downtown Central'}
                </span>
              </div>
              <h2 id="redeem-bonus-title" className="text-xl font-bold tracking-tight">Disburse Referral Bonus</h2>
              <p className="text-xs text-emerald-100">
                Student: <span className="font-semibold text-white">{referrer.name}</span> ({referrer.smartId})
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Summary Balance Card */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface-elevated p-3.5 text-center">
            <div>
              <span className="text-[11px] text-text-muted block">Total Earned</span>
              <span className="text-sm font-bold text-text-primary mt-0.5 block font-mono">
                {formatAdminFinanceCurrency(referrer.bonusEarned)}
              </span>
            </div>
            <div className="border-x border-border">
              <span className="text-[11px] text-text-muted block">Already Redeemed</span>
              <span className="text-sm font-bold text-text-secondary mt-0.5 block font-mono">
                {formatAdminFinanceCurrency(referrer.redeemed)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">Available Balance</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block font-mono">
                {formatAdminFinanceCurrency(referrer.balance)}
              </span>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Disbursement Channel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('fee_adjustment');
                  setNotes('Adjusted against next month desk subscription');
                }}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                  mode === 'fee_adjustment'
                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                    : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <span>Adjust in Next Fee</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Deduct directly from student&apos;s upcoming desk subscription invoice
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('cash_upi');
                  setNotes('Paid via Cash / UPI Counter Transfer');
                }}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                  mode === 'cash_upi'
                    ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                    : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
                  <IndianRupee className="h-4 w-4 text-indigo-500" />
                  <span>Disburse Cash / UPI</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Hand over cash counter disbursement or transfer via UPI
                </p>
              </button>
            </div>
          </div>

          {/* Amount to Redeem Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="redeem-amount" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Redemption Amount (₹ INR)
              </label>
              <button
                type="button"
                onClick={() => setAmountRupees(maxBalanceRupees)}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Max (₹{maxBalanceRupees})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">₹</span>
              <input
                id="redeem-amount"
                type="number"
                min="1"
                max={maxBalanceRupees}
                value={amountRupees || ''}
                onChange={(e) => {
                  setAmountRupees(Number(e.target.value));
                  setError(null);
                }}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono font-semibold"
                placeholder="Enter amount..."
                required
              />
            </div>
          </div>

          {/* Reference Notes Input */}
          <div className="space-y-1.5">
            <label htmlFor="redeem-notes" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Accounts Reference / Notes
            </label>
            <input
              id="redeem-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Adjusted in May 2026 invoice, or UPI UTR: 8942019"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Disbursement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
