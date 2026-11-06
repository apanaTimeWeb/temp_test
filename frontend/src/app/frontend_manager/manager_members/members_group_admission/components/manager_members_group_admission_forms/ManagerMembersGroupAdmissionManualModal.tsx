'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Users2, X, Plus, CheckCircle2, LayoutList, SlidersHorizontal } from 'lucide-react';
import { ManagerMembersGroupAdmissionCardView } from './ManagerMembersGroupAdmissionCardView';
import { ManagerMembersGroupAdmissionTableView } from './ManagerMembersGroupAdmissionTableView';

export interface GroupStudentEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  bloodGroup?: string;
  college?: string;
  address?: string;
  guardianName?: string;
  guardianPhone: string;
  emergencyPhone?: string;
  preparationFor: string;
  plan: string;
  shift: string;
  seatPreference: string;
  lockerPreference?: string;
  paymentMode?: string;
}

export interface ManagerMembersGroupAdmissionManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (batchName: string, students: GroupStudentEntry[]) => void;
}

const SHIFT_OPTIONS = [
  'Morning (06:00 AM – 02:00 PM)',
  'Evening (02:00 PM – 10:00 PM)',
  'Night (10:00 PM – 06:00 AM)',
  'Full Day (06:00 AM – 10:00 PM)',
  'Dual Shift (Morning + Evening)',
  'Dual Shift (Evening + Night)',
];

const PLAN_OPTIONS = [
  'Basic Monthly (₹1,000/mo)',
  'Pro Monthly (₹1,500/mo)',
  'Quarterly Standard (₹2,700/qtr)',
  'Half-Yearly Saver (₹5,000/half-yr)',
  'Annual Elite (₹9,500/yr)',
];

export function ManagerMembersGroupAdmissionManualModal({
  isOpen,
  onClose,
  onConfirm,
}: ManagerMembersGroupAdmissionManualModalProps) {
  const [batchName, setBatchName] = useState('');
  const [viewStyle, setViewStyle] = useState<'card' | 'table'>('card');
  const [manualRows, setManualRows] = useState<GroupStudentEntry[]>([
    {
      id: '1',
      name: '',
      phone: '',
      email: '',
      gender: 'Male',
      plan: 'Pro Monthly (₹1,500/mo)',
      shift: 'Morning (06:00 AM – 02:00 PM)',
      seatPreference: 'Any Seat',
      guardianPhone: '',
      preparationFor: 'UPSC Civil Services',
    },
    {
      id: '2',
      name: '',
      phone: '',
      email: '',
      gender: 'Female',
      plan: 'Pro Monthly (₹1,500/mo)',
      shift: 'Evening (02:00 PM – 10:00 PM)',
      seatPreference: 'AC Cabin',
      guardianPhone: '',
      preparationFor: 'SSC CGL',
    },
  ]);

  if (!isOpen) return null;

  const addStudent = () => {
    setManualRows([
      ...manualRows,
      {
        id: String(Date.now()),
        name: '',
        phone: '',
        email: '',
        gender: 'Male',
        plan: 'Pro Monthly (₹1,500/mo)',
        shift: 'Morning (06:00 AM – 02:00 PM)',
        seatPreference: 'Any Seat',
        guardianPhone: '',
        preparationFor: 'General Competitive',
      },
    ]);
  };

  const removeStudent = (index: number) => {
    if (manualRows.length <= 1) return;
    setManualRows(manualRows.filter((_, i) => i !== index));
  };

  const updateStudent = (index: number, field: keyof GroupStudentEntry, value: string) => {
    const updated = [...manualRows];
    const target = updated[index];
    if (target) {
      // @ts-expect-error dynamic key assignment
      target[field] = value;
      setManualRows(updated);
    }
  };

  const handleConfirm = () => {
    const valid = manualRows.filter((r) => r.name.trim().length > 0 && r.phone.trim().length >= 10);
    if (valid.length === 0) {
      toast.error('Please fill at least one student name and a valid 10-digit phone number.');
      return;
    }
    onConfirm(batchName.trim() || 'Co-Study Group Batch', manualRows);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Users2 size={22} className="text-primary" />
              <span>Manual Group Admission Application</span>
            </h2>
            <p className="text-xs text-secondary mt-0.5">Physical admission form simulation for batch/group enrollments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-floating p-1 rounded-lg border border-border text-xs">
              <button
                type="button"
                onClick={() => setViewStyle('card')}
                className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  viewStyle === 'card' ? 'bg-card text-primary shadow-xs' : 'text-secondary hover:text-primary'
                }`}
              >
                <LayoutList size={13} /> Detailed Form View
              </button>
              <button
                type="button"
                onClick={() => setViewStyle('table')}
                className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  viewStyle === 'table' ? 'bg-card text-primary shadow-xs' : 'text-secondary hover:text-primary'
                }`}
              >
                <SlidersHorizontal size={13} /> Compact Roster
              </button>
            </div>
            <button type="button" onClick={onClose} className="text-secondary hover:text-primary" aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Batch Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 bg-surface-highlight p-3.5 rounded-xl border border-border">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-primary block mb-1">Group / Coaching Batch Reference</label>
            <input
              type="text"
              className="mgr-input text-xs"
              placeholder="e.g. Drishti IAS Prelims Batch / SSC CGL Study Circle"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Total Members Enrolling</label>
            <div className="mgr-input text-xs font-bold text-primary flex items-center justify-between bg-card">
              <span>{manualRows.length} Students</span>
              <span className="text-xs font-normal text-success">Group Discount Eligible</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {viewStyle === 'card' ? (
            <ManagerMembersGroupAdmissionCardView
              manualRows={manualRows}
              updateStudent={updateStudent}
              removeStudent={removeStudent}
              shiftOptions={SHIFT_OPTIONS}
              planOptions={PLAN_OPTIONS}
            />
          ) : (
            <ManagerMembersGroupAdmissionTableView
              manualRows={manualRows}
              updateStudent={updateStudent}
              removeStudent={removeStudent}
              shiftOptions={SHIFT_OPTIONS}
              planOptions={PLAN_OPTIONS}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center shrink-0 pt-3 border-t border-border">
          <button type="button" onClick={addStudent} className="mgr-btn-ghost flex items-center gap-1.5 text-xs font-semibold">
            <Plus size={15} /> Add Another Student Application
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} className="mgr-btn-primary flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} /> Complete & Register Group ({manualRows.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
