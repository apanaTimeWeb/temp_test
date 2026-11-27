'use client';

import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface LockerAssignableStudent {
  name: string;
  smartId: string;
  exam: string;
  plan: string;
}

export const LOCKER_ASSIGNABLE_STUDENTS: LockerAssignableStudent[] = [
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

interface ManagerLockersManagementStudentDropdownProps {
  selectedStudent: LockerAssignableStudent | null;
  onSelectStudent: (student: LockerAssignableStudent | null) => void;
}

export function ManagerLockersManagementStudentDropdown({
  selectedStudent,
  onSelectStudent,
}: ManagerLockersManagementStudentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredStudents = LOCKER_ASSIGNABLE_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.smartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.exam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (student: LockerAssignableStudent) => {
    onSelectStudent(student);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectStudent(null);
    setSearchTerm('');
    setIsOpen(true);
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-xs font-semibold text-secondary uppercase tracking-wider block">
        Select Student <span className="text-danger">*</span>
      </label>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        <input
          maxLength={100}
          type="text"
          value={selectedStudent ? selectedStudent.name : searchTerm}
          onChange={(e) => {
            if (selectedStudent) onSelectStudent(null);
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
              onClick={handleClear}
              className="p-1 text-secondary hover:text-primary rounded-md cursor-pointer motion-safe:transition-colors"
              title="Clear selection"
            >
              <X size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 text-secondary hover:text-primary rounded-md cursor-pointer motion-safe:transition-colors"
            >
              <ChevronDown size={14} className={`motion-safe:transition-transform motion-safe:duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-1.5 space-y-1 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:zoom-in-95">
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary flex items-center justify-between border-b border-border pb-1 mb-1">
              <span>Student Directory</span>
              <span>{filteredStudents.length} Students</span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="py-4 text-center text-xs text-secondary">No matching student found.</div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedStudent?.smartId === student.smartId;
                return (
                  <div
                    key={student.smartId}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelect(student)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(student);
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg border motion-safe:transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-primary bg-primary-subtle ring-1 ring-primary'
                        : 'border-transparent hover:bg-surface-hover hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs shrink-0">
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

      {selectedStudent && (
        <div className="p-3 rounded-xl bg-surface border border-primary flex items-center justify-between text-xs motion-safe:animate-in motion-safe:fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs">
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
            onClick={handleClear}
            className="text-xs text-secondary hover:text-primary underline cursor-pointer"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
