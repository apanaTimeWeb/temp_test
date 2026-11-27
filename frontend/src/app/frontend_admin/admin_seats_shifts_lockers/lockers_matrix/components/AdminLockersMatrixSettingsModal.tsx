'use client';
// RESPONSIBILITY: Locker monthly rent, refundable caution deposit, and key replacement policy configuration modal.

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertCircle, IndianRupee, KeyRound, Save, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  const applyPreset = (rent: number, deposit: number, lostKey: number, late: number) => {
    setMonthlyRent(rent);
    setSecurityDeposit(deposit);
    setLostKeyFee(lostKey);
    setLateFeePerDay(late);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyRent < 0 || securityDeposit < 0) {
      toast.error('Fees cannot be negative.', { id: 'admin-lockers-settings-invalid' });
      return;
    }

    onSavePolicy({
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      lostKeyFee: Number(lostKeyFee),
      lateFeePerDay: Number(lateFeePerDay),
      branchName,
    });
    toast.success('Locker rent & caution deposit settings saved successfully!', { id: 'admin-lockers-settings-saved' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
              <KeyRound size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Locker Rent &amp; Caution Deposit Settings
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Set monthly subscription fees, refundable security deposit, and lost key charges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Quick Pricing Presets</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(200, 500, 150, 20)}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-border-focus motion-safe:transition-colors"
              >
                Standard (₹200/mo · ₹500 Dep)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(350, 750, 200, 30)}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-border-focus motion-safe:transition-colors"
              >
                Pro Metal Box (₹350/mo · ₹750 Dep)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(150, 300, 100, 15)}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-success motion-safe:transition-colors"
              >
                Exam Special (₹150/mo · ₹300 Dep)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="locker-monthly-rent" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <IndianRupee size={13} className="text-primary" aria-hidden="true" />
                <span>Monthly Locker Rent (₹)</span>
              </label>
              <input
                id="locker-monthly-rent"
                type="number"
                min={0}
                max={10000}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
              <span className="text-[10px] text-text-secondary">Added to student&apos;s monthly desk subscription</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="locker-security-deposit" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-success-text" aria-hidden="true" />
                <span>Refundable Caution Deposit (₹)</span>
              </label>
              <input
                id="locker-security-deposit"
                type="number"
                min={0}
                max={10000}
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
              <span className="text-[10px] text-text-secondary">Returned upon locker key surrender at exit</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="locker-lost-key-fee" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <KeyRound size={13} className="text-warning-text" aria-hidden="true" />
                <span>Lost Key Replacement Charge (₹)</span>
              </label>
              <input
                id="locker-lost-key-fee"
                type="number"
                min={0}
                max={5000}
                value={lostKeyFee}
                onChange={(e) => setLostKeyFee(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
              <span className="text-[10px] text-text-secondary">Deducted if key is damaged or mislaid</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="locker-late-fee" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <AlertCircle size={13} className="text-danger-text" aria-hidden="true" />
                <span>Late Key Return Daily Fee (₹)</span>
              </label>
              <input
                id="locker-late-fee"
                type="number"
                min={0}
                max={1000}
                value={lateFeePerDay}
                onChange={(e) => setLateFeePerDay(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
              <span className="text-[10px] text-text-secondary">Charged per day after membership expiry</span>
            </div>
          </div>

          <div className="rounded-xl border border-border-focus bg-primary-subtle p-4 space-y-2">
            <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <KeyRound size={13} aria-hidden="true" /> Admission Receipt Formula
            </span>
            <div className="text-xs text-text-primary flex items-center justify-between border-t border-border pt-2">
              <span>First Allotment Due (Rent + Security Deposit):</span>
              <strong className="text-success-text font-mono text-sm">₹{monthlyRent + securityDeposit}</strong>
            </div>
            <div className="text-[11px] text-text-secondary">
              * ₹{securityDeposit} caution money is tracked in Security Deposits Ledger and refunded at exit.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors cursor-pointer"
            >
              <Save size={15} aria-hidden="true" />
              <span>Save Policy Settings</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminLockersMatrixSettingsModal;
