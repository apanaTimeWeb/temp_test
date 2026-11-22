'use client';

import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import {
applyReferralBonusToNextRenewal,
getReferralRenewalFinanceUrl,
parseBonusNumber,
parseReferrerInfo,
} from '@/app/frontend_manager/manager_members/members_referral_bonus/utils/ManagerMembersReferralBonusRenewalAdjustment';
import {
Calendar,
Check,
ExternalLink,
IndianRupee,
Receipt,
ShieldCheck,
Gift,
User,
X
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';

export interface ManagerMembersReferralBonusApplyRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: ReferralRow | null;
  onApplied: (updatedReferral: ReferralRow) => void;
}

const DISCOUNT_PRESETS = [200, 300, 500];

export function ManagerMembersReferralBonusApplyRenewalModal({
  isOpen,
  onClose,
  referral,
  onApplied,
}: ManagerMembersReferralBonusApplyRenewalModalProps) {
  const [discountAmount, setDiscountAmount] = useState<number>(500);

  useEffect(() => {
    if (referral) {
      setDiscountAmount(parseBonusNumber(referral.bonus) || 500);
    }
  }, [referral]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !referral) return null;

  const referrerDetails = parseReferrerInfo(referral.referrer);
  const standardFee = referrerDetails.monthlyFee || 1800;
  const netPayable = Math.max(0, standardFee - discountAmount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    if (discountAmount <= 0) {
      toast.error('Discount amount must be greater than ₹0.');
      return;
    }

    const result = applyReferralBonusToNextRenewal(
      referral.id,
      referral.referrer,
      referral.referred,
      discountAmount
    );

    const updatedReferral: ReferralRow = {
      ...referral,
      status: 'Adjusted in Renewal',
      method: 'Fee Discount',
      bonus: `₹${discountAmount}`,
      appliedDiscountAmount: discountAmount,
      appliedRenewalDate: new Date().toISOString().slice(0, 10),
    };

    onApplied(updatedReferral);
    toast.success(`🎉 ${result.message}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-renewal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-dialog space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Receipt size={22} className="text-emerald-500" />
            </div>
            <div>
              <h3 id="apply-renewal-title" className="text-base sm:text-lg font-bold text-primary">
                Apply Referral Bonus to Renewal
              </h3>
              <p className="text-xs text-secondary">
                Adjust referral credit into member&#39;s upcoming monthly fee renewal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-zebra transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-xl bg-surface border border-border text-xs flex items-start gap-2.5 shrink-0">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-secondary leading-relaxed">
            Library Referral Policy: Referral bonuses are adjusted directly against student&#39;s next monthly fee renewal instead of cash payouts.
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleApply} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Referrer & Referred Details Card */}
          <div className="p-3.5 rounded-xl bg-surface-highlight border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Referrer Student Profile
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {referral.id}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">{referrerDetails.name}</h4>
                  <p className="text-xs text-secondary">
                    Smart ID: {referrerDetails.smartId} · Seat: {referrerDetails.seat}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-secondary block">Current Plan</span>
                <span className="font-semibold text-primary">{referrerDetails.currentPlan}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-secondary">
              <span>Referred Student: <strong className="text-primary">{referral.referred}</strong></span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} className="text-primary" />
                <span>Next Renewal: {referrerDetails.nextRenewalDate}</span>
              </span>
            </div>
          </div>

          {/* Discount Amount Adjustment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="renewal-discount-input" className="font-semibold text-primary block">
                Renewal Discount Amount (₹) *
              </label>
              <span className="text-[11px] text-secondary">Presets: ₹200 - ₹500</span>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex items-center gap-2">
              {DISCOUNT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDiscountAmount(preset)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    discountAmount === preset
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                      : 'bg-surface border-border text-secondary hover:text-primary hover:bg-surface-zebra'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="mgr-input-icon-wrap relative">
              <IndianRupee size={15} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-success pointer-events-none" />
              <input
                id="renewal-discount-input"
                type="number"
                min="50"
                max={standardFee}
                step="50"
                required
                className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9 font-mono"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </div>
          </div>

          {/* Live Renewal Calculation Card */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-secondary">
              <span>Standard Monthly Renewal Fee</span>
              <span className="font-mono text-primary font-semibold">₹{standardFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Gift size={13} className="text-emerald-400" />
                <span>Referral Bonus Deduction</span>
              </span>
              <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary block">
                  Net Payable Renewal Fee
                </span>
                <span className="text-[10px] text-secondary">
                  To be collected at next monthly cycle
                </span>
              </div>
              <span className="text-base font-extrabold font-mono text-emerald-400">
                ₹{netPayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Direct Link to Finance Renewals Desk */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
            <span className="text-[11px] text-secondary">
              Want to collect renewal payment at the desk now?
            </span>
            <a
              href={getReferralRenewalFinanceUrl(referrerDetails.name, discountAmount, referral.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
              title="Open Finance Renewals desk in new tab"
            >
              <span>Renewal Desk</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 sm:gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary hover:bg-surface-zebra transition-colors cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Check size={14} />
              <span>Apply to Next Renewal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerMembersReferralBonusApplyRenewalModal;
