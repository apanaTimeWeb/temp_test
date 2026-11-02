'use client';

import { useState } from 'react';
import { Users2, X, Plus, Trash2, CheckCircle2, LayoutList, SlidersHorizontal, User, Phone, ShieldCheck, BookOpen } from 'lucide-react';

export interface GroupStudentEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  plan: string;
  shift: string;
  seatPreference: string;
  guardianPhone: string;
  preparationFor: string;
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
      alert('Please fill at least one student name and a valid 10-digit phone number.');
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 bg-floating/60 p-3.5 rounded-xl border border-border">
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
            /* Card/Physical Sheet Form View */
            <div className="space-y-4">
              {manualRows.map((row, index) => (
                <div key={row.id} className="p-4 rounded-xl border border-border bg-card/60 shadow-xs space-y-3 relative hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      Student Admission Form #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStudent(index)}
                      disabled={manualRows.length <= 1}
                      className="text-danger hover:text-danger-text text-xs flex items-center gap-1 disabled:opacity-30"
                    >
                      <Trash2 size={14} /> Remove Form
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Full Name *</label>
                      <div className="relative">
                        <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
                        <input
                          type="text"
                          className="mgr-input pl-8 text-xs"
                          placeholder="e.g. Ramesh Kumar"
                          value={row.name}
                          onChange={(e) => updateStudent(index, 'name', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Mobile (WhatsApp) *</label>
                      <div className="relative">
                        <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
                        <input
                          type="tel"
                          className="mgr-input pl-8 text-xs font-mono"
                          placeholder="9876543210"
                          value={row.phone}
                          onChange={(e) => updateStudent(index, 'phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Gender</label>
                      <select
                        className="mgr-select text-xs"
                        value={row.gender}
                        onChange={(e) => updateStudent(index, 'gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Target Exam</label>
                      <input
                        type="text"
                        className="mgr-input text-xs"
                        placeholder="e.g. UPSC / NEET"
                        value={row.preparationFor}
                        onChange={(e) => updateStudent(index, 'preparationFor', e.target.value)}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-secondary block mb-1">Shift Selection (Multi-Shift Available)</label>
                      <select
                        className="mgr-select text-xs font-medium"
                        value={row.shift}
                        onChange={(e) => updateStudent(index, 'shift', e.target.value)}
                      >
                        {SHIFT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Membership Plan</label>
                      <select
                        className="mgr-select text-xs"
                        value={row.plan}
                        onChange={(e) => updateStudent(index, 'plan', e.target.value)}
                      >
                        {PLAN_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Guardian Emergency Contact</label>
                      <input
                        type="tel"
                        className="mgr-input text-xs font-mono"
                        placeholder="Optional contact"
                        value={row.guardianPhone}
                        onChange={(e) => updateStudent(index, 'guardianPhone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-highlight border-b border-border text-left font-bold text-secondary uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Phone</th>
                    <th className="p-2.5">Gender</th>
                    <th className="p-2.5">Shift</th>
                    <th className="p-2.5">Plan</th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {manualRows.map((row, index) => (
                    <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                      <td className="p-2.5 font-bold text-secondary">{index + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="mgr-input py-1 text-xs"
                          placeholder="Full Name"
                          value={row.name}
                          onChange={(e) => updateStudent(index, 'name', e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="tel"
                          className="mgr-input py-1 text-xs font-mono"
                          placeholder="9876543210"
                          value={row.phone}
                          onChange={(e) => updateStudent(index, 'phone', e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <select
                          className="mgr-select py-1 text-xs"
                          value={row.gender}
                          onChange={(e) => updateStudent(index, 'gender', e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          className="mgr-select py-1 text-xs"
                          value={row.shift}
                          onChange={(e) => updateStudent(index, 'shift', e.target.value)}
                        >
                          {SHIFT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          className="mgr-select py-1 text-xs"
                          value={row.plan}
                          onChange={(e) => updateStudent(index, 'plan', e.target.value)}
                        >
                          {PLAN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeStudent(index)}
                          disabled={manualRows.length <= 1}
                          className="text-danger hover:text-danger-text disabled:opacity-30"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

