'use client';

import type { ManagerMembersDirectoryLeaveDetails,ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { Check,Clock,PauseCircle,X } from 'lucide-react';
import { useEffect,useState } from 'react';
import { createPortal } from 'react-dom';

export interface ManagerMembersDirectoryFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ManagerMembersDirectoryRecord | null;
  onConfirmFreeze: (details: ManagerMembersDirectoryLeaveDetails) => void;
}

export const MANAGER_MEMBERS_LEAVE_REASONS = [
  { id: 'home_visit', label: 'Home Visit / Family Function', desc: 'Out of town for family visits or festivals' },
  { id: 'exam_outstation', label: 'Outstation Competitive Exam', desc: 'Travel for UPSC/SSC/State/NEET exam centers' },
  { id: 'medical_leave', label: 'Medical Leave / Illness', desc: 'Doctor advised rest or hospitalization' },
  { id: 'college_exams', label: 'Semester College Exams', desc: 'University end-term examination preparation' },
  { id: 'personal_break', label: 'Personal Travel / Break', desc: 'Temporary break from study schedule' },
  { id: 'other', label: 'Other Reason', desc: 'Other specific reason (specify in remarks)' },
] as const;

export function ManagerMembersDirectoryFreezeModal({
  isOpen,
  onClose,
  member,
  onConfirmFreeze,
}: ManagerMembersDirectoryFreezeModalProps) {
  const [mounted, setMounted] = useState(false);

  // Default dates: today and +15 days
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultEndStr = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [selectedReason, setSelectedReason] = useState<string>(MANAGER_MEMBERS_LEAVE_REASONS[0].label);
  const [notes, setNotes] = useState('');
  const [extendExpiry, setExtendExpiry] = useState(true);
  const [releaseSeatBuffer, setReleaseSeatBuffer] = useState(true);

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

  if (!isOpen || !member) return null;

  // Compute duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const calculatedDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmFreeze({
      startDate,
      endDate,
      days: calculatedDays,
      reason: selectedReason,
      notes: notes.trim(),
      extendExpiry,
      releaseSeatBuffer,
      approvedAt: new Date().toISOString(),
    });
    onClose();
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="freeze-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0c0f28] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-[#0c0f28] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <PauseCircle size={22} />
            </div>
            <div>
              <h2 id="freeze-modal-title" className="font-bold text-base text-white">
                Apply Leave / Freeze Membership
              </h2>
              <p className="text-xs text-amber-300/80">
                Pause active plan validity while student is away for home or exams
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

        {/* Member Context Banner */}
        <div className="px-6 py-3 bg-[#060818] border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">Student: </span>
            <span className="font-bold text-slate-100">{member.name}</span>
            <span className="font-mono text-slate-400 ml-2">({member.id})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              Seat: {member.seat || 'General'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
              Shift: {member.shift || 'Morning'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
              Current Expiry: {member.expiryDate}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dates & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="leave-start-date" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Leave Start Date *
              </label>
              <input
                id="leave-start-date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#060818] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="leave-end-date" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Leave End Date *
              </label>
              <input
                id="leave-end-date"
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#060818] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Freeze Duration
              </label>
              <div className="flex items-center gap-1.5 h-[38px] px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Clock size={14} className="text-amber-400" />
                <span>{calculatedDays} Days Paused</span>
              </div>
            </div>
          </div>

          {/* Reason Selection Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Primary Reason for Leave / Break *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MANAGER_MEMBERS_LEAVE_REASONS.map((r) => {
                const isSelected = selectedReason === r.label;
                const isOther = r.id === 'other';
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isOther ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/70 text-white shadow-md'
                        : 'bg-[#080a20] border-indigo-500/20 text-slate-300 hover:border-indigo-500/40 hover:bg-[#0b0e2a]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="leaveReason"
                      value={r.label}
                      checked={isSelected}
                      onChange={() => setSelectedReason(r.label)}
                      className="mt-0.5 text-amber-500 focus:ring-amber-400 h-3.5 w-3.5 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-100 block">{r.label}</span>
                      <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                        {r.desc}
                      </span>
                    </div>
                    {isSelected && <Check size={14} className="text-amber-400 shrink-0 mt-0.5" />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Auto Extensions & Buffer Checkboxes */}
          <div className="p-3.5 rounded-xl bg-[#080a20] border border-indigo-500/20 space-y-2.5 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={extendExpiry}
                onChange={(e) => setExtendExpiry(e.target.checked)}
                className="mt-0.5 rounded border-indigo-500/40 bg-[#060818] text-amber-500 focus:ring-amber-400 h-4 w-4 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-200">
                  Auto-Extend Plan Expiry by {calculatedDays} Days (Recommended)
                </span>
                <p className="text-[11px] text-slate-400">
                  The student will not lose days they have paid for. Plan expiry date moves forward automatically.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={releaseSeatBuffer}
                onChange={(e) => setReleaseSeatBuffer(e.target.checked)}
                className="mt-0.5 rounded border-indigo-500/40 bg-[#060818] text-amber-500 focus:ring-amber-400 h-4 w-4 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-200">
                  Temporary Seat Buffer Release ({member.seat || 'Assigned Seat'})
                </span>
                <p className="text-[11px] text-slate-400">
                  Allows manager to allocate this seat for 1-day demo passes while student is on leave. The original student retains rights upon return.
                </p>
              </div>
            </label>
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="freeze-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Manager Remarks (Optional)
            </label>
            <textarea maxLength={1000}
              id="freeze-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Student informed in person; will rejoin on 1st of next month after exams."
              className="w-full bg-[#060818] border border-indigo-500/25 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-amber-950/50 transition-all cursor-pointer"
            >
              <PauseCircle size={15} />
              Confirm & Pause Membership
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
