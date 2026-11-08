'use client';

import { useState, useMemo, useEffect } from 'react';
import { Gift, X, CheckCircle2, AlertCircle } from 'lucide-react';
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

    const newRecord: ReferralRow = {
      id: nextId,
      referrer: referrer.trim(),
      referred: referred.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      bonus: `₹${bonusAmount || '500'}`,
      method,
    };
    onAddReferral(newRecord);
    toast.success(`Referral recorded: ${referrer} referred ${referred}!`);
    setReferrer('');
    setReferred('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="referral-modal-title">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Gift size={20} className="text-primary" />
            <h3 id="referral-modal-title" className="text-base font-bold text-primary">Record New Student Referral</h3>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              <AlertCircle size={14} /> Referrer and Referred student cannot be identical.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-primary block mb-1">Bonus Amount (₹)</label>
              <input
                type="number"
                min="50"
                step="50"
                className="mgr-input font-mono"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-primary block mb-1">Reward Method</label>
              <select className="mgr-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="Fee Discount">Fee Discount</option>
                <option value="UPI Cash">UPI Cash</option>
                <option value="Locker Credit">Locker Credit</option>
                <option value="Validity Extension">15-Day Free Extension</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={Boolean(referrer && referred && referrer === referred)}
              className="mgr-btn-primary flex items-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={15} /> Confirm Referral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
