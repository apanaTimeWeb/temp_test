'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Award, Briefcase, Calendar, CheckCircle2, GraduationCap, Phone, User, X, Check } from 'lucide-react';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
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
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [exam, setExam] = useState('');
  const [duration, setDuration] = useState('12 Months');
  const [leftDate, setLeftDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentStatus, setCurrentStatus] = useState<MembersAlumniRow['currentStatus']>('Cleared Exam');
  const [designation, setDesignation] = useState('');
  const [testimonial, setTestimonial] = useState('');

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_MEMBERS_DEMO_RECORDS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: `Phone: ${s.phone} · Target: ${s.preparationFor || 'Competitive Exams'}`,
      badge: s.status,
    }));
  }, []);

  const selectedStudent = useMemo(() => {
    return MANAGER_MEMBERS_DEMO_RECORDS.find((s) => s.id === selectedStudentId);
  }, [selectedStudentId]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    const found = MANAGER_MEMBERS_DEMO_RECORDS.find((s) => s.id === studentId);
    if (found) {
      setName(found.name);
      setPhone(found.phone);
      if (found.preparationFor) {
        setExam(found.preparationFor);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please select an enrolled library student.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error('Valid 10-digit mobile number is required.');
      return;
    }
    if (!exam.trim()) {
      toast.error('Qualified Exam or Achievement is required.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const newRecord: MembersAlumniRow = {
      id: `ALM-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      phone: cleanPhone.length === 10 ? cleanPhone : phone.trim(),
      leftDate,
      duration: duration.trim() || '1 Year',
      exam: exam.trim(),
      designation: designation.trim(),
      testimonial: testimonial.trim(),
      currentStatus,
    };

    onAdd(newRecord);
    toast.success(`Alumni record created for ${name} (${exam})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="add-alumni-title">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 id="add-alumni-title" className="text-lg font-bold text-primary">Add Alumni Record from Library Students</h2>
              <p className="text-xs text-secondary">Select an enrolled or past student to celebrate their competitive achievement</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Step 1: Search & Pick Student */}
          <div className="space-y-1.5 p-3 rounded-xl bg-surface border border-border">
            <label className="font-semibold text-primary block">
              Select Enrolled Library Member *
            </label>
            <SearchableCombobox
              options={studentOptions}
              value={selectedStudentId}
              onChange={handleSelectStudent}
              placeholder="Search student by name or Smart ID (e.g. Rahul, LIB-001)..."
              searchPlaceholder="Type name, phone, or Smart ID..."
            />
            {selectedStudent && (
              <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-success-bg text-success border border-border font-medium">
                <span className="flex items-center gap-1.5">
                  <Check size={14} /> Selected: {selectedStudent.name} ({selectedStudent.id})
                </span>
                <span className="text-[11px] text-secondary">
                  Seat: {selectedStudent.seat || 'General'} · Phone: +91 {selectedStudent.phone}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name (Auto-populated) */}
            <div>
              <label className="font-semibold text-primary block mb-1">Student Full Name *</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  required
                  readOnly={Boolean(selectedStudent)}
                  className={`mgr-input pl-9 text-xs ${selectedStudent ? 'bg-surface cursor-not-allowed font-semibold' : ''}`}
                  placeholder="Select student above..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Phone (Auto-populated) */}
            <div>
              <label className="font-semibold text-primary block mb-1">Contact Phone *</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="tel"
                  required
                  readOnly={Boolean(selectedStudent)}
                  className={`mgr-input pl-9 text-xs font-mono ${selectedStudent ? 'bg-surface cursor-not-allowed font-semibold' : ''}`}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Exam / Achievement */}
            <div className="sm:col-span-2">
              <label className="font-semibold text-primary block mb-1">Qualified Exam / Achievement *</label>
              <div className="relative">
                <Award size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  required
                  className="mgr-input pl-9 text-xs"
                  placeholder="e.g. UPSC CSE 2026 (AIR 114) / SSC CGL / NEET PG / Judiciary"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                />
              </div>
            </div>

            {/* Designation / Rank */}
            <div>
              <label className="font-semibold text-primary block mb-1">Designation / Posting / Rank</label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  className="mgr-input pl-9 text-xs"
                  placeholder="e.g. Assistant Commissioner / Bank PO"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            {/* Current Status */}
            <div>
              <label className="font-semibold text-primary block mb-1">Milestone Category</label>
              <select
                className="mgr-select text-xs"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as MembersAlumniRow['currentStatus'])}
              >
                <option value="Cleared Exam">Cleared Exam (Rank Holder)</option>
                <option value="Employed">Employed in Govt / PSU / Corporate</option>
                <option value="Higher Studies">Higher Studies (Masters / Ph.D.)</option>
              </select>
            </div>

            {/* Duration at Library */}
            <div>
              <label className="font-semibold text-primary block mb-1">Study Tenure at Library</label>
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
              <label className="font-semibold text-primary block mb-1">Achievement / Exit Date</label>
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
              <label className="font-semibold text-primary block mb-1">Advice / Testimonial for Library Juniors</label>
              <textarea
                rows={2}
                className="mgr-input text-xs resize-none"
                placeholder="e.g. The 14-hour silent AC reading hall and disciplined environment were instrumental in my success!"
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
