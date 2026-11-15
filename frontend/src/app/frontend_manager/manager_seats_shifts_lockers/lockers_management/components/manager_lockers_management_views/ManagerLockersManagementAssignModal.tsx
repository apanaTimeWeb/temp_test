'use client';

import React, { useState } from 'react';
import { UserPlus, X, Search, Check, Key, ShieldCheck, User, DoorClosed } from 'lucide-react';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

const SAMPLE_DIRECTORY_STUDENTS = [
  { name: 'Aarav Sharma', smartId: 'LIB-101', exam: 'UPSC CSE', plan: 'Full Day' },
  { name: 'Ananya Patel', smartId: 'LIB-102', exam: 'NEET Pre-Med', plan: 'Morning Shift' },
  { name: 'Rohan Verma', smartId: 'LIB-103', exam: 'JEE Advanced', plan: 'Evening Shift' },
  { name: 'Priya Singh', smartId: 'LIB-104', exam: 'CA Finalist', plan: 'Full Day' },
  { name: 'Rahul Gupta', smartId: 'LIB-105', exam: 'GATE CS', plan: 'Morning Shift' },
  { name: 'Sneha Joshi', smartId: 'LIB-106', exam: 'SSC CGL', plan: 'Evening Shift' },
  { name: 'Vikram Malhotra', smartId: 'LIB-107', exam: 'State PSC', plan: 'Full Day' },
  { name: 'Neha Choudhary', smartId: 'LIB-108', exam: 'CLAT Pre-Law', plan: 'Morning Shift' },
];

export interface ManagerLockersManagementAssignModalProps {
  locker: Locker;
  dialogRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onAssign: (studentName: string, studentId: string) => void;
}

export function ManagerLockersManagementAssignModal({
  locker,
  dialogRef,
  onClose,
  onAssign,
}: ManagerLockersManagementAssignModalProps) {
  const [mode, setMode] = useState<'directory' | 'custom'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof SAMPLE_DIRECTORY_STUDENTS[0] | null>(
    SAMPLE_DIRECTORY_STUDENTS[0]
  );
  const [customName, setCustomName] = useState('');
  const [customSmartId, setCustomSmartId] = useState('');
  const [depositCollected, setDepositCollected] = useState(true);
  const [keyHandedOver, setKeyHandedOver] = useState(true);

  const filteredStudents = SAMPLE_DIRECTORY_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.smartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.exam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'directory') {
      if (!selectedStudent) return;
      onAssign(selectedStudent.name, selectedStudent.smartId);
    } else {
      if (!customName.trim()) return;
      const sId = customSmartId.trim() || `LIB-${Math.floor(100 + Math.random() * 900)}`;
      onAssign(customName.trim(), sId);
    }
  };

  const isSubmitDisabled = mode === 'directory' ? !selectedStudent : !customName.trim();

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
                Assign this locker and issue key to an active library member
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
          {/* Student Mode Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Select Member <span className="text-danger">*</span>
              </label>
              <div className="flex items-center p-0.5 rounded-lg bg-surface border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setMode('directory')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    mode === 'directory'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Member Directory
                </button>
                <button
                  type="button"
                  onClick={() => setMode('custom')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    mode === 'custom'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  + Direct Entry
                </button>
              </div>
            </div>

            {mode === 'directory' ? (
              <div className="space-y-2.5">
                {/* Search in Directory */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search by student name, smart ID, or exam..."
                    className="mgr-input !pl-10 !pr-8 text-xs w-full h-9 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Candidate List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {filteredStudents.length === 0 ? (
                    <div className="py-4 text-center text-xs text-secondary">
                      No matching student found. Try switching to Direct Entry.
                    </div>
                  ) : (
                    filteredStudents.map((student) => {
                      const isSelected = selectedStudent?.smartId === student.smartId;
                      return (
                        <div
                          key={student.smartId}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedStudent(student)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedStudent(student);
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border bg-surface hover:bg-surface-hover'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-primary truncate">{student.name}</p>
                              <p className="text-[10px] text-secondary font-mono truncate">
                                {student.smartId} · {student.exam}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                              <Check size={12} />
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Selected Student Highlight */}
                {selectedStudent && (
                  <div className="p-2.5 rounded-xl bg-card border border-primary/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      <div>
                        <span className="font-bold text-primary">{selectedStudent.name}</span>
                        <span className="text-[11px] text-secondary font-mono ml-2">
                          ({selectedStudent.smartId})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary-subtle text-primary">
                      {selectedStudent.plan}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-secondary">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter student full name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="mgr-input text-xs w-full h-9 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-secondary">Smart ID / Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. LIB-204 (Auto-generated if blank)"
                    value={customSmartId}
                    onChange={(e) => setCustomSmartId(e.target.value)}
                    className="mgr-input text-xs w-full h-9 font-mono rounded-xl"
                  />
                </div>
              </div>
            )}
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
                Physical key KEY-{locker.lockerId} handed over to student
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
              disabled={isSubmitDisabled}
              className={`mgr-btn-primary flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-semibold shadow-xs ${
                isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
