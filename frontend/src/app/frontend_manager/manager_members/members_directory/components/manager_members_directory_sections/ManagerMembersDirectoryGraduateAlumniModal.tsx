'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GraduationCap, Award, Calendar, Clock, Armchair, X, Check } from 'lucide-react';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export interface ManagerGraduateAlumniDetails {
  exam: string;
  designation: string;
  currentStatus: 'Cleared Exam' | 'Employed' | 'Higher Studies' | 'Relocated' | 'Other';
  duration: string;
  testimonial: string;
  leftDate: string;
  releaseSeat: boolean;
}

export interface ManagerMembersDirectoryGraduateAlumniModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ManagerMembersDirectoryRecord | null;
  onGraduate: (member: ManagerMembersDirectoryRecord, details: ManagerGraduateAlumniDetails) => void;
}

export function ManagerMembersDirectoryGraduateAlumniModal({
  isOpen,
  onClose,
  member,
  onGraduate,
}: ManagerMembersDirectoryGraduateAlumniModalProps) {
  const [exam, setExam] = useState('');
  const [designation, setDesignation] = useState('');
  const [currentStatus, setCurrentStatus] = useState<ManagerGraduateAlumniDetails['currentStatus']>('Cleared Exam');
  const [duration, setDuration] = useState('12 Months');
  const [leftDate, setLeftDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [testimonial, setTestimonial] = useState('');
  const [releaseSeat, setReleaseSeat] = useState(true);

  useEffect(() => {
    if (member) {
      setExam(member.preparationFor || '');
      setReleaseSeat(Boolean(member.seat));
      setDesignation('');
      setTestimonial('');
      setLeftDate(new Date().toISOString().slice(0, 10));
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam.trim()) {
      toast.error('Qualified Exam or Achievement is required.');
      return;
    }

    onGraduate(member, {
      exam: exam.trim(),
      designation: designation.trim(),
      currentStatus,
      duration: duration.trim() || '12 Months',
      testimonial: testimonial.trim(),
      leftDate,
      releaseSeat,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="graduate-alumni-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 id="graduate-alumni-title" className="text-base font-bold text-primary">
                Graduate Member to Alumni
              </h3>
              <p className="text-xs text-secondary">
                Transition student to the alumni network and record their success
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-zebra transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Member Preview Strip */}
        <div className="p-3.5 rounded-xl bg-surface-zebra border border-border flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-primary block text-sm">{member.name}</span>
            <span className="text-secondary">ID: {member.id} · Phone: {member.phone}</span>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-0.5">
              {member.seat ? `Seat ${member.seat}` : 'General / No Seat'}
            </span>
            <span className="text-secondary block text-[11px]">{member.type} Plan</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="alumni-exam" className="block text-xs font-semibold text-secondary mb-1">
                Target / Qualified Exam *
              </label>
              <div className="relative">
                <Award size={15} className="absolute left-3 top-2.5 text-secondary" />
                <input
                  id="alumni-exam"
                  type="text"
                  required
                  placeholder="e.g. UPSC CSE, SBI PO, NEET, CA"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="alumni-designation" className="block text-xs font-semibold text-secondary mb-1">
                Designation / Rank / Outcome
              </label>
              <input
                id="alumni-designation"
                type="text"
                placeholder="e.g. AIR 142 (IAS), Officer (Scale I)"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="alumni-status" className="block text-xs font-semibold text-secondary mb-1">
                Current Status
              </label>
              <select
                id="alumni-status"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as ManagerGraduateAlumniDetails['currentStatus'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Cleared Exam">Cleared Exam</option>
                <option value="Employed">Employed</option>
                <option value="Higher Studies">Higher Studies</option>
                <option value="Relocated">Relocated</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="alumni-duration" className="block text-xs font-semibold text-secondary mb-1">
                Study Duration
              </label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-2.5 text-secondary" />
                <input
                  id="alumni-duration"
                  type="text"
                  placeholder="e.g. 14 Months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="alumni-leftDate" className="block text-xs font-semibold text-secondary mb-1">
                Graduation Date
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-2.5 text-secondary" />
                <input
                  id="alumni-leftDate"
                  type="date"
                  value={leftDate}
                  onChange={(e) => setLeftDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="alumni-testimonial" className="block text-xs font-semibold text-secondary mb-1">
              Testimonial / Success Quote (Optional)
            </label>
            <textarea
              id="alumni-testimonial"
              rows={2}
              placeholder="e.g. The silent AC library and high-speed wifi were essential to my daily consistency."
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Seat & Locker Auto-Vacate Option */}
          {member.seat && (
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Armchair size={16} className="text-purple-600 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    Vacate Assigned Seat {member.seat} {member.locker ? `& Locker ${member.locker}` : ''}
                  </span>
                  <span className="text-[11px] text-secondary block">
                    Frees up the desk in the Seat Matrix for new admissions
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                id="release-seat-checkbox"
                checked={releaseSeat}
                onChange={(e) => setReleaseSeat(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary hover:bg-surface-zebra transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Check size={14} />
              <span>Graduate to Alumni</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ManagerMembersDirectoryGraduateAlumniModal;

