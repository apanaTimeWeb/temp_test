'use client';

import { useState } from 'react';
import { Award, Briefcase, Calendar, CheckCircle2, GraduationCap, Phone, User, X } from 'lucide-react';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';

export interface ManagerMembersAlumniAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (alumni: MembersAlumniRow) => void;
}

export function ManagerMembersAlumniAddModal({
  isOpen,
  onClose,
  onAdd,
}: ManagerMembersAlumniAddModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [exam, setExam] = useState('');
  const [duration, setDuration] = useState('12 Months');
  const [leftDate, setLeftDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentStatus, setCurrentStatus] = useState<MembersAlumniRow['currentStatus']>('Cleared Exam');
  const [designation, setDesignation] = useState('');
  const [testimonial, setTestimonial] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Student Full Name is required.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      alert('Valid 10-digit mobile number is required.');
      return;
    }
    if (!exam.trim()) {
      alert('Qualified Exam or Achievement is required.');
      return;
    }

    const newRecord: MembersAlumniRow = {
      id: `ALM-${String(Date.now()).slice(-3)}`,
      name: name.trim(),
      phone: phone.trim(),
      leftDate,
      duration: duration.trim() || '1 Year',
      exam: designation.trim() ? `${exam.trim()} (${designation.trim()})` : exam.trim(),
      currentStatus,
    };

    onAdd(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Add Successful Alumni Record</h2>
              <p className="text-xs text-secondary">Celebrate student competitive achievements and career milestones</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Student Full Name *</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  required
                  className="mgr-input pl-9 text-xs"
                  placeholder="e.g. Saurabh Mishra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Contact Phone (10-Digit) *</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="tel"
                  required
                  className="mgr-input pl-9 text-xs font-mono"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Exam / Achievement */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-primary block mb-1">Qualified Exam / Achievement *</label>
              <div className="relative">
                <Award size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  required
                  className="mgr-input pl-9 text-xs"
                  placeholder="e.g. UPSC Civil Services / SSC CGL / SBI PO / CA Final / NEET PG"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                />
              </div>
            </div>

            {/* Designation / Rank */}
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Rank / Designation / Post</label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  className="mgr-input pl-9 text-xs"
                  placeholder="e.g. AIR 128 / Tax Inspector"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            {/* Current Status */}
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Current Milestone Status</label>
              <select
                className="mgr-select text-xs"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as MembersAlumniRow['currentStatus'])}
              >
                <option value="Cleared Exam">Cleared Exam</option>
                <option value="Employed">Employed in Govt / PSU / Tech</option>
                <option value="Higher Studies">Higher Studies (Masters / Ph.D.)</option>
              </select>
            </div>

            {/* Duration at Library */}
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Study Tenure at Library</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="e.g. 14 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {/* Exit / Qualification Date */}
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Qualification / Exit Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="date"
                  className="mgr-input pl-9 text-xs"
                  value={leftDate}
                  onChange={(e) => setLeftDate(e.target.value)}
                />
              </div>
            </div>

            {/* Testimonial / Advice for Juniors */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-primary block mb-1">Student Review / Advice for Library Juniors</label>
              <textarea
                rows={2}
                className="mgr-input text-xs resize-none"
                placeholder="e.g. The 14-hour silent AC environment and punctual floor discipline were crucial for my preparation!"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} /> Save Alumni Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

