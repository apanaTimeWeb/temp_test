'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Phone,
  Quote,
  User,
  X,
  Check,
} from 'lucide-react';
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
      setPhone(found.phone.replace(/\D/g, '').slice(0, 10));
      if (found.preparationFor) {
        setExam(found.preparationFor);
      }
    }
  };

  const handleResetForm = () => {
    setSelectedStudentId('');
    setName('');
    setPhone('');
    setExam('');
    setDuration('12 Months');
    setLeftDate(new Date().toISOString().slice(0, 10));
    setCurrentStatus('Cleared Exam');
    setDesignation('');
    setTestimonial('');
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Student full name must be at least 2 characters.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '').slice(0, 10);
    if (cleanPhone.length !== 10) {
      toast.error('Valid 10-digit mobile number is required.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Mobile number must start with 6, 7, 8, or 9.');
      return;
    }

    const trimmedExam = exam.trim();
    if (!trimmedExam || trimmedExam.length < 2) {
      toast.error('Qualified Exam or Achievement is required.');
      return;
    }

    const newRecord: MembersAlumniRow = {
      id: `ALM-${Date.now().toString().slice(-4)}`,
      name: trimmedName,
      phone: cleanPhone,
      leftDate,
      duration: duration.trim() || '1 Year',
      exam: trimmedExam,
      designation: designation.trim(),
      testimonial: testimonial.trim(),
      currentStatus,
    };

    onAdd(newRecord);
    handleResetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-alumni-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-dialog space-y-4 sm:space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <GraduationCap size={22} className="text-primary" />
            </div>
            <div>
              <h2 id="add-alumni-title" className="text-base sm:text-lg font-bold text-primary">
                Add Alumni Record
              </h2>
              <p className="text-xs text-secondary">
                Select an enrolled student or enter details to celebrate their achievement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-danger hover:opacity-80 rounded-lg hover:bg-danger-bg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="shrink-0 text-danger" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Step 1: Search & Pick Student */}
          <div className="space-y-1.5 p-3 rounded-xl bg-surface border border-border relative z-30">
            <label className="font-semibold text-primary block">
              Select Enrolled Library Member (Optional)
            </label>
            <SearchableCombobox
              options={studentOptions}
              value={selectedStudentId}
              onChange={handleSelectStudent}
              placeholder="Search student by name or Smart ID (e.g. Rahul, LIB-001)..."
              searchPlaceholder="Type name, phone, or Smart ID..."
            />
            {selectedStudent && (
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-success-bg text-success border border-border font-medium">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-success shrink-0" />
                  <span>Selected: {selectedStudent.name} ({selectedStudent.id})</span>
                </span>
                <span className="text-[11px] text-secondary">
                  Seat: {selectedStudent.seat || 'General'} · Phone: +91 {selectedStudent.phone}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Student Name */}
            <div>
              <label className="font-semibold text-primary block mb-1">Student Full Name *</label>
              <div className="mgr-input-icon-wrap relative">
                <User size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={80}
                  readOnly={Boolean(selectedStudent)}
                  className={`mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9 ${selectedStudent ? 'bg-surface cursor-not-allowed font-semibold' : ''}`}
                  placeholder={selectedStudent ? '' : 'Type student full name...'}
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 80))}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="font-semibold text-primary block mb-1">Contact Phone (10 Digits) *</label>
              <div className="mgr-input-icon-wrap relative">
                <Phone size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-info pointer-events-none" />
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  readOnly={Boolean(selectedStudent)}
                  className={`mgr-input mgr-input-with-icon !pl-10 text-xs font-mono w-full h-9 ${selectedStudent ? 'bg-surface cursor-not-allowed font-semibold' : ''}`}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>

            {/* Exam / Achievement */}
            <div className="sm:col-span-2">
              <label className="font-semibold text-primary block mb-1">Qualified Exam / Achievement *</label>
              <div className="mgr-input-icon-wrap relative">
                <Award size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-success pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={100}
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
                  placeholder="e.g. UPSC CSE 2026 (AIR 114) / SSC CGL / NEET PG / Judiciary"
                  value={exam}
                  onChange={(e) => setExam(e.target.value.slice(0, 100))}
                />
              </div>
            </div>

            {/* Designation / Rank */}
            <div>
              <label className="font-semibold text-primary block mb-1">Designation / Posting / Rank</label>
              <div className="mgr-input-icon-wrap relative">
                <Briefcase size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-info pointer-events-none" />
                <input
                  type="text"
                  maxLength={80}
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
                  placeholder="e.g. Assistant Commissioner / Bank PO"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value.slice(0, 80))}
                />
              </div>
            </div>

            {/* Current Status */}
            <div>
              <label className="font-semibold text-primary block mb-1">Milestone Category</label>
              <div className="mgr-input-icon-wrap relative">
                <GraduationCap size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none" />
                <select
                  className="mgr-select !pl-10 text-xs w-full h-9"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as MembersAlumniRow['currentStatus'])}
                >
                  <option value="Cleared Exam">Cleared Exam (Rank Holder)</option>
                  <option value="Employed">Employed in Govt / PSU / Corporate</option>
                  <option value="Higher Studies">Higher Studies (Masters / Ph.D.)</option>
                </select>
              </div>
            </div>

            {/* Duration at Library */}
            <div>
              <label className="font-semibold text-primary block mb-1">Study Tenure at Library</label>
              <div className="mgr-input-icon-wrap relative">
                <Clock size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none" />
                <input
                  type="text"
                  maxLength={40}
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
                  placeholder="e.g. 14 Months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value.slice(0, 40))}
                />
              </div>
            </div>

            {/* Exit / Qualification Date */}
            <div>
              <label className="font-semibold text-primary block mb-1">Achievement / Exit Date</label>
              <div className="mgr-input-icon-wrap relative">
                <Calendar size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                <input
                  type="date"
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
                  value={leftDate}
                  onChange={(e) => setLeftDate(e.target.value)}
                />
              </div>
            </div>

            {/* Testimonial / Advice for Juniors */}
            <div className="sm:col-span-2">
              <label className="font-semibold text-primary flex items-center gap-1.5 mb-1">
                <Quote size={13} className="text-primary shrink-0" />
                <span>Advice / Testimonial for Library Juniors</span>
              </label>
              <textarea
                rows={2}
                maxLength={500}
                className="mgr-input text-xs resize-none w-full p-2.5"
                placeholder="e.g. The 14-hour silent AC reading hall and disciplined environment were instrumental in my success!"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value.slice(0, 500))}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 sm:gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="mgr-btn mgr-btn-secondary inline-flex items-center justify-center gap-1.5 text-xs h-9 px-4 w-full sm:w-auto font-semibold transition-colors"
            >
              <X size={15} className="text-danger shrink-0" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-5 w-full sm:w-auto font-semibold transition-colors"
            >
              <CheckCircle2 size={16} className="text-on-primary shrink-0" />
              <span>Save Alumni Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
