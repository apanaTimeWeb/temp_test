'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Award,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  Phone,
  Quote,
  Search,
  User,
  X,
} from 'lucide-react';
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
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [exam, setExam] = useState('');
  const [duration, setDuration] = useState('12 Months');
  const [leftDate, setLeftDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentStatus, setCurrentStatus] = useState<MembersAlumniRow['currentStatus']>('Cleared Exam');
  const [designation, setDesignation] = useState('');
  const [testimonial, setTestimonial] = useState('');

  // Close student dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setIsStudentPickerOpen(false);
      }
    }
    if (isStudentPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isStudentPickerOpen]);

  // Load enrolled members with localStorage fallback to fixtures
  const availableStudents = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('manager_member_records');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // storage fallback
      }
    }
    return MANAGER_MEMBERS_DEMO_RECORDS;
  }, []);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return availableStudents;
    return availableStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.department && s.department.toLowerCase().includes(q))
    );
  }, [availableStudents, studentSearch]);

  const selectedStudent = useMemo(() => {
    return availableStudents.find((s) => s.id === selectedStudentId);
  }, [availableStudents, selectedStudentId]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    const found = availableStudents.find((s) => s.id === studentId);
    if (found) {
      setName(found.name);
      setPhone(found.phone.replace(/\D/g, '').slice(0, 10));
      if (found.department || found.preparationFor) {
        setExam(found.department || found.preparationFor || '');
      }
    }
  };

  const handleClearSelectedStudent = () => {
    setSelectedStudentId('');
    setName('');
    setPhone('');
    setExam('');
  };

  const handleResetForm = () => {
    setSelectedStudentId('');
    setIsStudentPickerOpen(false);
    setStudentSearch('');
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
    toast.success(`Alumni record created for ${trimmedName} (${trimmedExam})`);
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
            className="p-1.5 text-danger hover:opacity-80 rounded-lg hover:bg-danger-bg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} className="shrink-0 text-danger" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Step 1: Search & Pick Student */}
          <div className="space-y-1.5 p-3 sm:p-3.5 rounded-xl bg-surface border border-border relative z-30">
            <label className="font-semibold text-primary block">
              Select Enrolled Library Member (Optional)
            </label>

            {/* Opaque Searchable Combobox Trigger */}
            <div className="relative" ref={studentDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStudentPickerOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-[#18181b] hover:border-primary/50 text-left transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Search size={15} className="text-primary shrink-0" />
                  {selectedStudent ? (
                    <span className="font-semibold text-primary truncate">
                      {selectedStudent.name} ({selectedStudent.id}) · {selectedStudent.phone}
                    </span>
                  ) : (
                    <span className="text-secondary truncate">
                      Click to search or pick student (e.g. Rahul, LIB-001)...
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={15}
                  className={`text-secondary shrink-0 transition-transform duration-200 ${
                    isStudentPickerOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {/* 100% Solid Opaque Popover - Zero see-through overlap */}
              {isStudentPickerOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border-2 border-primary/40 shadow-2xl overflow-hidden"
                  style={{ backgroundColor: '#18181b' }}
                >
                  {/* Search Filter Box */}
                  <div className="p-2.5 border-b border-border bg-[#222225] flex items-center gap-2">
                    <Search size={14} className="text-primary shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Type name, phone, or Smart ID to filter..."
                      className="w-full bg-transparent text-xs text-primary placeholder:text-secondary outline-none"
                    />
                    {studentSearch && (
                      <button
                        type="button"
                        onClick={() => setStudentSearch('')}
                        className="p-1 text-secondary hover:text-danger rounded cursor-pointer"
                        title="Clear search"
                      >
                        <X size={13} />
                      </button>
                    )}
                    <span className="text-[10px] text-secondary whitespace-nowrap bg-surface-highlight px-2 py-0.5 rounded-full border border-border font-medium shrink-0">
                      {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
                    </span>
                  </div>

                  {/* Scrollable Students List */}
                  <ul className="max-h-56 overflow-y-auto p-1.5 space-y-1 text-xs">
                    {filteredStudents.length === 0 ? (
                      <li className="p-4 text-center text-secondary text-xs">
                        No enrolled students found matching &quot;{studentSearch}&quot;. You can enter details manually below.
                      </li>
                    ) : (
                      filteredStudents.map((s) => {
                        const isSelected = selectedStudentId === s.id;
                        return (
                          <li
                            key={s.id}
                            onClick={() => {
                              handleSelectStudent(s.id);
                              setIsStudentPickerOpen(false);
                              setStudentSearch('');
                            }}
                            className={`flex items-center justify-between gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                              isSelected
                                ? 'bg-primary-subtle text-primary border-primary/40 font-semibold'
                                : 'hover:bg-surface-hover text-primary border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 text-primary font-bold text-xs">
                                {s.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-primary text-xs">{s.name}</span>
                                  <span className="font-mono text-[10px] font-bold text-primary bg-primary-subtle px-1.5 py-0.5 rounded border border-border">
                                    {s.id}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                      s.status === 'Active' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                                    }`}
                                  >
                                    {s.status}
                                  </span>
                                </div>
                                <span className="text-[11px] text-secondary mt-0.5 truncate">
                                  Phone: +91 {s.phone} · Target: {s.department || s.preparationFor || 'Competitive Exams'}
                                </span>
                              </div>
                            </div>
                            {isSelected ? (
                              <Check size={16} className="text-success font-bold shrink-0" />
                            ) : (
                              <span className="text-[10px] font-semibold text-secondary hover:text-primary shrink-0">
                                Select
                              </span>
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Selected Student Banner */}
            {selectedStudent && (
              <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-success-bg text-success border border-border font-medium">
                <span className="flex items-center gap-1.5 text-xs truncate">
                  <Check size={14} className="text-success shrink-0" />
                  <span>Selected: <strong>{selectedStudent.name}</strong> ({selectedStudent.id})</span>
                  <span className="text-secondary text-[11px] hidden sm:inline">
                    · Seat: {selectedStudent.seat || 'General'} · Phone: +91 {selectedStudent.phone}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleClearSelectedStudent}
                  className="text-xs text-danger font-bold hover:underline shrink-0 self-end sm:self-auto cursor-pointer"
                >
                  Clear / Change
                </button>
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
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
                  placeholder="Type student full name..."
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
                  className="mgr-input mgr-input-with-icon !pl-10 text-xs font-mono w-full h-9"
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
                  placeholder="e.g. UPSC CSE 2026 (AIR 114) / SSC CGL / NEET PG / Banking PO"
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
                  placeholder="e.g. IAS Officer / SDM / Assistant Manager"
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
              className="mgr-btn mgr-btn-secondary inline-flex items-center justify-center gap-1.5 text-xs h-9 px-4 w-full sm:w-auto font-semibold transition-colors cursor-pointer"
            >
              <X size={15} className="text-danger shrink-0" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-5 w-full sm:w-auto font-semibold transition-colors cursor-pointer"
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

export default ManagerMembersAlumniAddModal;
