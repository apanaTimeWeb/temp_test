'use client';

import { useState, useMemo, useEffect } from 'react';
import { Gift, X, CheckCircle2, AlertCircle, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_REFERRAL_MEMBER_CANDIDATES } from '@/app/frontend_manager/manager_members/members_referral_bonus/mocks/manager_members_referral_bonus_fixtures/ManagerMembersReferralBonusFixtures';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';

interface ManagerMembersReferralBonusAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReferral: (newRecord: ReferralRow) => void;
  nextId: string;
}

export function ManagerMembersReferralBonusAddModal({
  isOpen,
  onClose,
  onAddReferral,
  nextId,
}: ManagerMembersReferralBonusAddModalProps) {
  const [referrer, setReferrer] = useState('');
  const [referred, setReferred] = useState('');
  const [bonusAmount, setBonusAmount] = useState('500');
  const [method, setMethod] = useState('Fee Discount');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_REFERRAL_MEMBER_CANDIDATES.map((s) => ({
      value: `${s.name} (${s.id})`,
      label: `${s.name} (${s.id})`,
      subLabel: `Phone: ${s.phone} · Seat: ${s.seat || 'General'}`,
      badge: s.status,
    }));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrer.trim()) {
      toast.error('Please select the Referrer Student.');
      return;
    }
    if (!referred.trim()) {
      toast.error('Please select the Referred New Student.');
      return;
    }
    if (referrer.trim() === referred.trim()) {
      toast.error('Referrer and Referred student cannot be the same person.');
      return;
    }

    const cleanBonus = Math.max(1, parseInt(bonusAmount, 10) || 500);

    const newRecord: ReferralRow = {
      id: nextId,
      referrer: referrer.trim(),
      referred: referred.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      bonus: `₹${cleanBonus}`,
      method,
    };
    onAddReferral(newRecord);
    toast.success(`Referral recorded: ${referrer} referred ${referred}!`);
    setReferrer('');
    setReferred('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-dialog space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <Gift size={22} className="text-primary" />
            </div>
            <div>
              <h3 id="referral-modal-title" className="text-base sm:text-lg font-bold text-primary">
                Record New Student Referral
              </h3>
              <p className="text-xs text-secondary">
                Assign referral reward credits to an enrolled library member
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-danger hover:opacity-80 rounded-lg hover:bg-danger-bg transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} className="shrink-0 text-danger" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-2.5 rounded-xl bg-surface-highlight border border-border text-[11px] text-secondary flex items-start gap-2 shrink-0">
          <span className="text-primary font-bold">ℹ</span>
          <span>
            {"Referrals are automatically recorded when a new student declares their referrer on the New Admission Form. Use this form only for manual adjustments."}
          </span>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Referrer Student Picker */}
          <div>
            <label htmlFor="referral-referrer-select" className="font-semibold text-primary block mb-1">
              Referrer Student (Name & Smart ID) *
            </label>
            <SearchableCombobox
              options={studentOptions}
              value={referrer}
              onChange={setReferrer}
              aria-label="Referrer Student (Name & Smart ID)"
              placeholder="Search existing referrer student (e.g. Rahul, LIB-001)..."
              searchPlaceholder="Type student name or ID..."
            />
          </div>

          {/* Referred New Student Picker */}
          <div>
            <label htmlFor="referral-referred-select" className="font-semibold text-primary block mb-1">
              Referred New Student (Admitted Member) *
            </label>
            <SearchableCombobox
              options={studentOptions}
              value={referred}
              onChange={setReferred}
              aria-label="Referred New Student (Admitted Member)"
              placeholder="Search newly admitted student (e.g. Priya, LIB-002)..."
              searchPlaceholder="Type admitted student name or ID..."
            />
          </div>

          {referrer && referred && referrer === referred && (
            <p className="flex items-center gap-1.5 text-danger font-medium p-2 rounded-lg bg-danger-bg border border-border">
              <AlertCircle size={14} className="shrink-0 text-danger" />
              <span>Referrer and Referred student cannot be identical.</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="font-semibold text-primary block mb-1">Bonus Amount (₹)</label>
              <div className="mgr-input-icon-wrap relative">
                <IndianRupee size={15} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-success pointer-events-none" />
                <input
                  type="number"
                  min="50"
                  step="50"
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9 font-mono"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-primary block mb-1">Reward Method</label>
              <div className="mgr-input-icon-wrap relative">
                <Gift size={15} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none" />
                <select
                  className="mgr-select !pl-10 text-xs w-full h-9"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Fee Discount">Fee Discount</option>
                  <option value="UPI Cash">UPI Cash</option>
                  <option value="Locker Credit">Locker Credit</option>
                  <option value="Validity Extension">15-Day Free Extension</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 sm:gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn mgr-btn-secondary inline-flex items-center justify-center gap-1.5 text-xs h-9 px-4 w-full sm:w-auto font-semibold transition-colors"
            >
              <X size={15} className="text-danger shrink-0" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={Boolean(referrer && referred && referrer === referred)}
              className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-5 w-full sm:w-auto font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={16} className="text-on-primary shrink-0" />
              <span>Confirm Referral</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ManagerMembersReferralBonusAddModal;
