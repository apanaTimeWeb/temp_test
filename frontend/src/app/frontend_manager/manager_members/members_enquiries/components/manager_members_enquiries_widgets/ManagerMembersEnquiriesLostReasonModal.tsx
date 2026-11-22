'use client';

import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { AlertTriangle,Check,X,XCircle } from 'lucide-react';
import { useEffect,useState } from 'react';
import { createPortal } from 'react-dom';

export interface ManagerMembersEnquiriesLostReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Pick<ManagerMembersEnquiriesEnquiry, 'id' | 'name' | 'phone' | 'shift'> | null;
  onConfirm: (reason: string, notes?: string) => void;
}

export const MANAGER_CRM_LOST_REASONS = [
  { id: 'fee_high', label: 'High Fee Structure', desc: 'Fees above budget / expensive' },
  { id: 'seat_unavailable', label: 'Seat / Shift Unavailable', desc: 'Preferred seat or shift not available' },
  { id: 'joined_another', label: 'Joined Another Library', desc: 'Enrolled in a competitor library' },
  { id: 'distance_commute', label: 'Distance / Commute Issue', desc: 'Too far or travel inconvenience' },
  { id: 'timing_mismatch', label: 'Shift Timing Mismatch', desc: 'Slot hours do not match schedule' },
  { id: 'exam_postponed', label: 'Exam Postponed / Stopped Prep', desc: 'Preparation stopped or exam delayed' },
  { id: 'other', label: 'Other Reason', desc: 'Other specific reason (specify in remarks)' },
] as const;

export function ManagerMembersEnquiriesLostReasonModal({
  isOpen,
  onClose,
  enquiry,
  onConfirm,
}: ManagerMembersEnquiriesLostReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(MANAGER_CRM_LOST_REASONS[0].label);
  const [notes, setNotes] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lost-reason-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog (Direct presentation without inner scroll box) */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0c0f28] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900/80 via-rose-950/90 to-[#0c0f28] border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 id="lost-reason-modal-title" className="font-bold text-base text-white">
                Mark Enquiry as Lost
              </h2>
              <p className="text-xs text-rose-300/80">
                Select the primary reason why this lead could not convert
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
        <div className="px-6 py-2.5 bg-[#060818] border-b border-indigo-500/15 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Candidate: </span>
            <span className="font-semibold text-slate-200">{enquiry.name}</span>
            <span className="text-slate-500 font-mono ml-2">({enquiry.phone})</span>
          </div>
          {enquiry.shift && (
            <span className="text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[11px]">
              Shift: {enquiry.shift}
            </span>
          )}
        </div>

        {/* Reason Selection Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              Select Primary Reason for Dropping *
            </label>
            {/* Direct 2-Column Grid: All options directly visible without any inner scrollbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MANAGER_CRM_LOST_REASONS.map((r) => {
                const isSelected = selectedReason === r.label;
                const isOther = r.id === 'other';
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isOther ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500/70 text-white shadow-md'
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
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-100 block">{r.label}</span>
                      <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                        {r.desc}
                      </span>
                    </div>
                    {isSelected && <Check size={15} className="text-rose-400 shrink-0 mt-0.5" />}
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
              Manager Remarks / Additional Details (Optional)
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

  if (mounted && typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
