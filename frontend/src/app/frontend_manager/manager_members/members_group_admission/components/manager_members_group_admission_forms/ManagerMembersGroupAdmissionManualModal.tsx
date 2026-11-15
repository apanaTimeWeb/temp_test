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
    if (manualRows.length === 0) {
      toast.error('At least one student application is required.');
      return;
    }

    const seenPhones = new Set<string>();

    for (let i = 0; i < manualRows.length; i++) {
      const row = manualRows[i];
      if (!row) continue;
      const rowNum = i + 1;
      const trimmedName = row.name.trim();

      if (!trimmedName || trimmedName.length < 2) {
        toast.error(`Student #${rowNum}: Please enter a valid full name (minimum 2 letters).`);
        return;
      }

      const phone = row.phone.trim();
      if (!phone || phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        toast.error(
          `Student #${rowNum} (${trimmedName}): Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.`
        );
        return;
      }

      if (seenPhones.has(phone)) {
        toast.error(
          `Duplicate mobile number detected: Student #${rowNum} has the same phone number (${phone}) as another student in this batch.`
        );
        return;
      }
      seenPhones.add(phone);

      const guardianPhone = row.guardianPhone.trim();
      if (guardianPhone.length > 0) {
        if (guardianPhone.length !== 10 || !/^[6-9]\d{9}$/.test(guardianPhone)) {
          toast.error(
            `Student #${rowNum} (${trimmedName}): Guardian phone must be a valid 10-digit number starting with 6, 7, 8, or 9.`
          );
          return;
        }

        if (guardianPhone === phone) {
          toast.error(
            `Student #${rowNum} (${trimmedName}): Guardian phone cannot be the same as the student's mobile number.`
          );
          return;
        }
      }
    }

    onConfirm(batchName.trim() || 'Co-Study Group Batch', manualRows);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-2 sm:p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-3.5 sm:p-5 md:p-6 shadow-dialog space-y-4 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
              <Users2 size={22} className="text-primary shrink-0" />
              <span>Manual Group Admission Application</span>
            </h2>
            <p className="text-xs text-secondary mt-0.5">Physical admission form simulation for batch/group enrollments</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
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
            <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded" aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Batch Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 bg-surface-highlight p-3 sm:p-3.5 rounded-xl border border-border">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-primary block mb-1">Group / Coaching Batch Reference</label>
            <input
              type="text"
              maxLength={80}
              className="mgr-input text-xs"
              placeholder="e.g. Drishti IAS Prelims Batch / SSC CGL Study Circle"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value.slice(0, 80))}
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
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0 pt-3 border-t border-border">
          <button type="button" onClick={addStudent} className="mgr-btn-ghost flex items-center justify-center gap-1.5 text-xs font-semibold py-2">
            <Plus size={15} /> Add Another Student Application
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs flex-1 sm:flex-initial py-2 px-3">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} className="mgr-btn-primary flex items-center justify-center gap-2 text-xs flex-1 sm:flex-initial py-2 px-3">
              <CheckCircle2 size={16} /> Complete & Register Group ({manualRows.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
