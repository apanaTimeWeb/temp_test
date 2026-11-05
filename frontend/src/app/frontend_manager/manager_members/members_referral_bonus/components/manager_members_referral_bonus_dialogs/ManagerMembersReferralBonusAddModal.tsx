'use client';
import { useState } from 'react';
import { Gift, X, CheckCircle2 } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrer.trim() || !referred.trim()) return;
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
    setReferrer('');
    setReferred('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Gift size={20} className="text-primary" />
            <h3 className="text-base font-bold text-primary">Record New Student Referral</h3>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-primary block mb-1">Referrer Student (Name & Smart ID) *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar (LIB-1210)"
              className="mgr-input"
              value={referrer}
              onChange={(e) => setReferrer(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold text-primary block mb-1">Referred New Student Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alok Verma"
              className="mgr-input"
              value={referred}
              onChange={(e) => setReferred(e.target.value)}
            />
          </div>
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
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Save Referral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

