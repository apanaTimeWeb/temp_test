'use client';

import '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_styles/ManagerMembersDirectoryStyles.css';
import type { ManagerMembersDirectoryLeaveDetails, ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { Check, Clock, PauseCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  const calculatedDays = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));

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
      className="fixed inset-0 md-modal-shell flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm motion-safe:transition-opacity" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-2xl md-modal-card border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden motion-safe:animate-in fade-in zoom-in-95 motion-safe:duration-base my-auto text-white">
        <div className="px-6 py-4 md-freeze-header border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <PauseCircle size={22} />
            </div>
            <div>
              <h2 id="freeze-modal-title" className="font-bold text-base text-white">Apply Leave / Freeze Membership</h2>
              <p className="text-xs text-amber-300 opacity-80">Pause active plan validity while student is away for home or exams</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 motion-safe:transition-colors cursor-pointer"
            title="Close dialog"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-3 md-surface-sub border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">Student: </span>
            <span className="font-bold text-slate-100">{member.name}</span>
            <span className="font-mono text-slate-400 ml-2">({member.id})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">Seat: {member.seat || 'General'}</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">Shift: {member.shift || 'Morning'}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">Current Expiry: {member.expiryDate}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="leave-start-date" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Leave Start Date *</label>
              <input maxLength={30} id="leave-start-date" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full md-surface-sub border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer" />
            </div>
            <div>
              <label htmlFor="leave-end-date" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Leave End Date *</label>
              <input maxLength={30} id="leave-end-date" type="date" required min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full md-surface-sub border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Freeze Duration</label>
              <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Clock size={14} className="text-amber-400" />
                <span>{calculatedDays} Days Paused</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Primary Reason for Leave / Break *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MANAGER_MEMBERS_LEAVE_REASONS.map((r) => {
                const isSelected = selectedReason === r.label;
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer motion-safe:transition-all ${r.id === 'other' ? 'sm:col-span-2' : ''} ${
                      isSelected ? 'bg-amber-500/20 border-amber-500/70 text-white shadow-md' : 'md-surface-card border-indigo-500/20 text-slate-300 hover:border-indigo-500/40'
                    }`}
                  >
                    <input type="radio" name="leaveReason" value={r.label} checked={isSelected} onChange={() => setSelectedReason(r.label)} className="mt-0.5 text-amber-500 focus:ring-amber-400 h-3.5 w-3.5 cursor-pointer" />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-100 block">{r.label}</span>
                      <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{r.desc}</span>
                    </div>
                    {isSelected && <Check size={14} className="text-amber-400 shrink-0 mt-0.5" />}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl md-surface-card border border-indigo-500/20 space-y-2.5 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={extendExpiry} onChange={(e) => setExtendExpiry(e.target.checked)} className="mt-0.5 rounded border-indigo-500/40 md-surface-sub text-amber-500 focus:ring-amber-400 h-4 w-4 cursor-pointer" />
              <div>
                <span className="font-semibold text-slate-200">Auto-Extend Plan Expiry by {calculatedDays} Days (Recommended)</span>
                <p className="text-[11px] text-slate-400">The student will not lose days they have paid for. Plan expiry date moves forward automatically.</p>
              </div>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={releaseSeatBuffer} onChange={(e) => setReleaseSeatBuffer(e.target.checked)} className="mt-0.5 rounded border-indigo-500/40 md-surface-sub text-amber-500 focus:ring-amber-400 h-4 w-4 cursor-pointer" />
              <div>
                <span className="font-semibold text-slate-200">Temporary Seat Buffer Release ({member.seat || 'Assigned Seat'})</span>
                <p className="text-[11px] text-slate-400">Allows manager to allocate this seat for 1-day demo passes while student is on leave. The original student retains rights upon return.</p>
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="freeze-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Manager Remarks (Optional)</label>
            <textarea maxLength={1000} id="freeze-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Student informed in person; will rejoin on 1st of next month after exams." className="w-full md-surface-sub border border-indigo-500/25 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 motion-safe:transition-all resize-none" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-indigo-500/30 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 motion-safe:transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-amber-950/50 motion-safe:transition-all cursor-pointer">
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
