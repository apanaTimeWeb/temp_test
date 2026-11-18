'use client';
// RESPONSIBILITY: Locker monthly rent, refundable caution deposit, and key replacement policy configuration modal.

import { useState, useEffect } from 'react';
import { IndianRupee, KeyRound, ShieldCheck, X, Save, Sparkles, Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface LockerPricingPolicy {
  monthlyRent: number;
  securityDeposit: number;
  lostKeyFee: number;
  lateFeePerDay: number;
  branchName: string;
}

export interface AdminLockersMatrixSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPolicy: LockerPricingPolicy;
  onSavePolicy: (policy: LockerPricingPolicy) => void;
}

export function AdminLockersMatrixSettingsModal({
  isOpen,
  onClose,
  currentPolicy,
  onSavePolicy,
}: AdminLockersMatrixSettingsModalProps) {
  const [monthlyRent, setMonthlyRent] = useState(currentPolicy.monthlyRent);
  const [securityDeposit, setSecurityDeposit] = useState(currentPolicy.securityDeposit);
  const [lostKeyFee, setLostKeyFee] = useState(currentPolicy.lostKeyFee);
  const [lateFeePerDay, setLateFeePerDay] = useState(currentPolicy.lateFeePerDay);
  const [branchName, setBranchName] = useState(currentPolicy.branchName);

  useEffect(() => {
    if (isOpen) {
      setMonthlyRent(currentPolicy.monthlyRent);
      setSecurityDeposit(currentPolicy.securityDeposit);
      setLostKeyFee(currentPolicy.lostKeyFee);
      setLateFeePerDay(currentPolicy.lateFeePerDay);
      setBranchName(currentPolicy.branchName);
    }
  }, [isOpen, currentPolicy]);

  if (!isOpen) return null;

  const applyPreset = (rent: number, deposit: number, lostKey: number, late: number) => {
    setMonthlyRent(rent);
    setSecurityDeposit(deposit);
    setLostKeyFee(lostKey);
    setLateFeePerDay(late);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyRent < 0 || securityDeposit < 0) {
      toast.error('Fees cannot be negative.');
      return;
    }

    const updated: LockerPricingPolicy = {
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      lostKeyFee: Number(lostKeyFee),
      lateFeePerDay: Number(lateFeePerDay),
      branchName,
    };

    onSavePolicy(updated);
    toast.success('Locker rent & caution deposit settings saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/70 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Locker Rent & Caution Deposit Settings</h2>
              <p className="text-xs text-slate-400">Set monthly subscription fees, refundable security deposit, and lost key charges</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Pricing Presets</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(200, 500, 150, 20)}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-indigo-500 transition-colors"
              >
                Standard (₹200/mo · ₹500 Dep)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(350, 750, 200, 30)}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-indigo-500 transition-colors"
              >
                Pro Metal Box (₹350/mo · ₹750 Dep)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(150, 300, 100, 15)}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-emerald-500 transition-colors"
              >
                Exam Special (₹150/mo · ₹300 Dep)
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Rent */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <IndianRupee size={13} className="text-indigo-400" />
                <span>Monthly Locker Rent (₹)</span>
              </label>
              <input
                type="number"
                min={0}
                max={10000}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                required
              />
              <span className="text-[10px] text-slate-400">Added to student's monthly desk subscription</span>
            </div>

            {/* Refundable Deposit */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Refundable Caution Deposit (₹)</span>
              </label>
              <input
                type="number"
                min={0}
                max={10000}
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                required
              />
              <span className="text-[10px] text-slate-400">Returned upon locker key surrender at exit</span>
            </div>

            {/* Lost Key Fee */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound size={13} className="text-amber-400" />
                <span>Lost Key Replacement Charge (₹)</span>
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                value={lostKeyFee}
                onChange={(e) => setLostKeyFee(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                required
              />
              <span className="text-[10px] text-slate-400">Deducted if key is damaged or mislaid</span>
            </div>

            {/* Overstay penalty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertCircle size={13} className="text-rose-400" />
                <span>Late Key Return Daily Fee (₹)</span>
              </label>
              <input
                type="number"
                min={0}
                max={1000}
                value={lateFeePerDay}
                onChange={(e) => setLateFeePerDay(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                required
              />
              <span className="text-[10px] text-slate-400">Charged per day after membership expiry</span>
            </div>
          </div>

          {/* Policy Summary Card */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-2">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={13} /> Admission Receipt Formula
            </span>
            <div className="text-xs text-slate-300 flex items-center justify-between border-t border-indigo-500/20 pt-2">
              <span>First Allotment Due (Rent + Security Deposit):</span>
              <strong className="text-emerald-400 font-mono text-sm">
                ₹{monthlyRent + securityDeposit}
              </strong>
            </div>
            <div className="text-[11px] text-slate-400">
              * ₹{securityDeposit} caution money is tracked in Security Deposits Ledger and refunded at exit.
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>Save Policy Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLockersMatrixSettingsModal;
