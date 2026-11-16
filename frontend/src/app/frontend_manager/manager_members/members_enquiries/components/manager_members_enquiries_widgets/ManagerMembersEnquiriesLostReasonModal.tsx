'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, XCircle, Check } from 'lucide-react';
import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

export interface ManagerMembersEnquiriesLostReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Pick<ManagerMembersEnquiriesEnquiry, 'id' | 'name' | 'phone' | 'shift'> | null;
  onConfirm: (reason: string, notes?: string) => void;
}

export const MANAGER_CRM_LOST_REASONS = [
  { id: 'fee_high', label: 'High Fee Structure', desc: 'फीस ज्यादा थी / बजट से बाहर' },
  { id: 'seat_unavailable', label: 'Seat / Shift Unavailable', desc: 'पसंदीदा सीट या शिफ्ट उपलब्ध नहीं थी' },
  { id: 'joined_another', label: 'Joined Another Library', desc: 'दूसरी लाइब्रेरी ज्वाइन कर ली' },
  { id: 'distance_commute', label: 'Distance / Commute Issue', desc: 'लाइब्रेरी दूर थी / आने-जाने में परेशानी' },
  { id: 'timing_mismatch', label: 'Shift Timing Mismatch', desc: 'शिफ्ट टाइमिंग मैच नहीं हुई' },
  { id: 'exam_postponed', label: 'Exam Postponed / Stopped Prep', desc: 'तैयारी बंद कर दी / परीक्षा स्थगित' },
  { id: 'other', label: 'Other Reason', desc: 'अन्य कारण' },
] as const;

export function ManagerMembersEnquiriesLostReasonModal({
  isOpen,
  onClose,
  enquiry,
  onConfirm,
}: ManagerMembersEnquiriesLostReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(MANAGER_CRM_LOST_REASONS[0].label);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !enquiry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    onConfirm(selectedReason, notes.trim());
    setNotes('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lost-reason-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-[#0c0f28] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900/80 via-rose-950/90 to-[#0c0f28] border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 id="lost-reason-modal-title" className="font-bold text-base text-white">
                Mark Enquiry as Lost (ड्रॉप कारण)
              </h2>
              <p className="text-xs text-rose-300/80">
                Capture why the lead could not convert for analytics & reporting
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dialog"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lead Context Banner */}
        <div className="px-6 py-3 bg-[#060818] border-b border-indigo-500/15 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Candidate: </span>
            <span className="font-semibold text-slate-200">{enquiry.name}</span>
            <span className="text-slate-500 font-mono ml-2">({enquiry.phone})</span>
          </div>
          {enquiry.shift && (
            <span className="text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[11px]">
              {enquiry.shift}
            </span>
          )}
        </div>

        {/* Reason Selection Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Primary Reason for Dropping (वजह चुनें) *
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {MANAGER_CRM_LOST_REASONS.map((r) => {
                const isSelected = selectedReason === r.label;
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500/60 text-white shadow-sm'
                        : 'bg-[#080a20] border-indigo-500/20 text-slate-300 hover:border-indigo-500/40 hover:bg-[#0b0e2a]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="lostReason"
                      value={r.label}
                      checked={isSelected}
                      onChange={() => setSelectedReason(r.label)}
                      className="mt-0.5 text-rose-500 focus:ring-rose-400 h-3.5 w-3.5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-semibold block">{r.label}</span>
                      <span className="text-[11px] text-slate-400">{r.desc}</span>
                    </div>
                    {isSelected && <Check size={14} className="text-rose-400 shrink-0 mt-0.5" />}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="lost-reason-notes"
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1"
            >
              Manager Remarks / Additional Details (टिप्पणी / विकल्प)
            </label>
            <textarea
              id="lost-reason-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Student found library too far from coaching; offered 10% discount but declined."
              className="w-full bg-[#060818] border border-indigo-500/25 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-indigo-500/30 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-rose-950/50 transition-all cursor-pointer"
            >
              <XCircle size={15} />
              Confirm & Mark as Lost
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
