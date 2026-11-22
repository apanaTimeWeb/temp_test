'use client';

import { Check,ChevronDown,DoorClosed,Key,Search,ShieldCheck,UserPlus,X } from 'lucide-react';
import React,{ useEffect,useRef,useState } from 'react';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

const ALL_STUDENTS = [
  { name: 'Aarav Sharma', smartId: 'LIB-101', exam: 'UPSC CSE', plan: 'Full Day' },
  { name: 'Ananya Patel', smartId: 'LIB-102', exam: 'NEET Pre-Med', plan: 'Morning Shift' },
  { name: 'Rohan Verma', smartId: 'LIB-103', exam: 'JEE Advanced', plan: 'Evening Shift' },
  { name: 'Priya Singh', smartId: 'LIB-104', exam: 'CA Finalist', plan: 'Full Day' },
  { name: 'Rahul Gupta', smartId: 'LIB-105', exam: 'GATE CS', plan: 'Morning Shift' },
  { name: 'Sneha Joshi', smartId: 'LIB-106', exam: 'SSC CGL', plan: 'Evening Shift' },
  { name: 'Vikram Malhotra', smartId: 'LIB-107', exam: 'State PSC', plan: 'Full Day' },
  { name: 'Neha Choudhary', smartId: 'LIB-108', exam: 'CLAT Pre-Law', plan: 'Morning Shift' },
  { name: 'Aditya Nair', smartId: 'LIB-109', exam: 'CAT / MBA', plan: 'Evening Shift' },
  { name: 'Kavita Reddy', smartId: 'LIB-110', exam: 'Banking PO', plan: 'Full Day' },
  { name: 'Manish Tiwari', smartId: 'LIB-111', exam: 'UPSC CSE', plan: 'Morning Shift' },
  { name: 'Pooja Deshmukh', smartId: 'LIB-112', exam: 'CDS / NDA', plan: 'Full Day' },
];

export interface ManagerLockersManagementAssignModalProps {
  locker: Locker;
  dialogRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onAssign: (studentName: string, studentId: string, keyNumber?: string, expiryDate?: string) => void;
}

export function ManagerLockersManagementAssignModal({
  locker,
  dialogRef,
  onClose,
  onAssign,
}: ManagerLockersManagementAssignModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof ALL_STUDENTS[0] | null>(null);
  const [keyNumber, setKeyNumber] = useState<string>(locker.keyNumber || `KEY-${locker.lockerId}`);
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [depositCollected, setDepositCollected] = useState(true);
  const [keyHandedOver, setKeyHandedOver] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStudents = ALL_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.smartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.exam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    onAssign(selectedStudent.name, selectedStudent.smartId, keyNumber, expiryDate);
  };

  const handleSelectStudent = (student: typeof ALL_STUDENTS[0]) => {
    setSelectedStudent(student);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClearSelected = () => {
    setSelectedStudent(null);
    setSearchTerm('');
    setIsOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ss-locker-assign-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ss-locker-assign-title" className="text-base font-bold text-primary">
                  Allot Locker #{locker.lockerId}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success">
                  Available
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Select student from directory to assign locker and issue physical key
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Locker Bento Specs Card */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface border border-border text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-secondary uppercase font-semibold">Locker Desk</span>
            <div className="font-mono font-bold text-primary flex items-center gap-1">
              <DoorClosed size={13} className="text-primary" />
              <span>{locker.lockerId}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-secondary uppercase font-semibold">Key Tag</span>
            <div className="font-mono font-bold text-primary flex items-center gap-1">
              <Key size={13} className="text-primary" />
              <span>KEY-{locker.lockerId}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-secondary uppercase font-semibold">Deposit</span>
            <div className="font-bold text-success flex items-center gap-1">
              <ShieldCheck size={13} className="text-success" />
              <span>₹500.00</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Single Option: Searchable Student Dropdown */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider block">
              Select Student <span className="text-danger">*</span>
            </label>

            {/* Dropdown Input Container */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
              />
              <input
                type="text"
                value={selectedStudent ? selectedStudent.name : searchTerm}
                onChange={(e) => {
                  if (selectedStudent) setSelectedStudent(null);
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search student by name, Smart ID, or exam..."
                className="mgr-input !pl-10 !pr-10 text-xs w-full h-10 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {selectedStudent || searchTerm ? (
                  <button
                    type="button"
                    onClick={handleClearSelected}
                    className="p-1 text-secondary hover:text-primary rounded-md cursor-pointer transition-colors"
                    title="Clear selection"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="p-1 text-secondary hover:text-primary rounded-md cursor-pointer transition-colors"
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* Floating Dropdown List of All Students */}
              {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-1.5 space-y-1 animate-in fade-in-50 zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary flex items-center justify-between border-b border-border pb-1 mb-1">
                    <span>Student Directory</span>
                    <span>{filteredStudents.length} Students</span>
                  </div>

                  {filteredStudents.length === 0 ? (
                    <div className="py-4 text-center text-xs text-secondary">
                      No matching student found.
                    </div>
                  ) : (
                    filteredStudents.map((student) => {
                      const isSelected = selectedStudent?.smartId === student.smartId;
                      return (
                        <div
                          key={student.smartId}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={0}
                          onClick={() => handleSelectStudent(student)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectStudent(student);
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'border-primary bg-primary/10 ring-1 ring-primary'
                              : 'border-transparent hover:bg-surface-hover hover:border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-primary truncate">{student.name}</p>
                              <p className="text-[10px] text-secondary font-mono truncate">
                                {student.smartId} · {student.exam}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface text-secondary border border-border">
                              {student.plan}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                                <Check size={12} />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Selected Student Confirmation Pill */}
            {selectedStudent && (
              <div className="p-3 rounded-xl bg-surface border border-primary/30 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-primary">{selectedStudent.name}</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-primary-subtle text-primary">
                        {selectedStudent.smartId}
                      </span>
                    </div>
                    <p className="text-[11px] text-secondary mt-0.5">
                      Target Exam: {selectedStudent.exam} · Plan: {selectedStudent.plan}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelected}
                  className="text-xs text-secondary hover:text-primary underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Key Number & Library Seat Plan Auto-Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-surface border border-border text-xs">
            <div className="space-y-1">
              <label htmlFor="assign-key-number" className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Physical Key Number
              </label>
              <div className="relative">
                <Key size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  id="assign-key-number"
                  data-testid="manager-assign-key-number-input"
                  type="text"
                  value={keyNumber}
                  onChange={(e) => setKeyNumber(e.target.value)}
                  className="w-full h-9 pl-7 pr-2.5 rounded-lg border border-border bg-card text-primary font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={`KEY-${locker.lockerId}`}
                  required
                />
              </div>
              <p className="text-[10px] text-secondary">Numbered tag physically stamped on brass key.</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="assign-expiry-date" className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Linked Plan Expiry Date
              </label>
              <input
                id="assign-expiry-date"
                data-testid="manager-assign-expiry-date-input"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                required
              />
              <p className="text-[10px] text-secondary">Auto-links locker tenure with student seat plan.</p>
            </div>
          </div>

          {/* Acknowledgements */}
          <div className="p-3 rounded-xl bg-surface border border-border space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={depositCollected}
                onChange={(e) => setDepositCollected(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-primary font-medium">
                Collect ₹500 refundable security deposit (Recorded in Escrow)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={keyHandedOver}
                onChange={(e) => setKeyHandedOver(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-primary font-medium">
                Physical key {keyNumber} handed over to student
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              className="mgr-btn-outline text-xs px-3.5 py-2 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedStudent}
              className={`mgr-btn-primary flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-semibold shadow-xs ${
                !selectedStudent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <UserPlus size={14} />
              <span>Confirm Allotment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
