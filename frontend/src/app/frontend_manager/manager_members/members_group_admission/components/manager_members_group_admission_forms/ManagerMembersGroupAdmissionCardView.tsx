'use client';
import { Trash2, User, Phone } from 'lucide-react';
import type { GroupStudentEntry } from './ManagerMembersGroupAdmissionManualModal';

interface ManagerMembersGroupAdmissionCardViewProps {
  manualRows: GroupStudentEntry[];
  updateStudent: (index: number, field: keyof GroupStudentEntry, value: string) => void;
  removeStudent: (index: number) => void;
  shiftOptions: string[];
  planOptions: string[];
}

export function ManagerMembersGroupAdmissionCardView({
  manualRows,
  updateStudent,
  removeStudent,
  shiftOptions,
  planOptions,
}: ManagerMembersGroupAdmissionCardViewProps) {
  return (
    <div className="space-y-4">
      {manualRows.map((row, index) => (
        <div
          key={row.id}
          className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3 relative hover:border-primary transition-colors"
        >
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xs">
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
              <div className="mgr-input-icon-wrap">
                <User size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="text"
                  className="mgr-input mgr-input-with-icon text-xs"
                  placeholder="e.g. Ramesh Kumar"
                  value={row.name}
                  onChange={(e) => updateStudent(index, 'name', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Mobile (WhatsApp) *</label>
              <div className="mgr-input-icon-wrap">
                <Phone size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="tel"
                  maxLength={10}
                  className="mgr-input mgr-input-with-icon text-xs font-mono"
                  placeholder="10-digit mobile"
                  value={row.phone}
                  onChange={(e) => updateStudent(index, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
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
              <label className="text-xs font-medium text-secondary block mb-1">Target Exam (Optional)</label>
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
                {shiftOptions.map((opt) => (
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
                {planOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Date of Birth (Optional)</label>
              <input
                type="date"
                className="mgr-input text-xs"
                value={row.dob || ''}
                onChange={(e) => updateStudent(index, 'dob', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Blood Group</label>
              <select
                className="mgr-select text-xs"
                value={row.bloodGroup || ''}
                onChange={(e) => updateStudent(index, 'bloodGroup', e.target.value)}
              >
                <option value="">-- Select Blood Group (Optional) --</option>
                {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">College / Institute (Optional)</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="e.g. Delhi University"
                value={row.college || ''}
                onChange={(e) => updateStudent(index, 'college', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Guardian Full Name (Optional)</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="Father / Mother Name"
                value={row.guardianName || ''}
                onChange={(e) => updateStudent(index, 'guardianName', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Guardian Phone *</label>
              <input
                type="tel"
                maxLength={10}
                className="mgr-input text-xs font-mono"
                placeholder="10-digit mobile"
                value={row.guardianPhone}
                onChange={(e) => updateStudent(index, 'guardianPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Payment Mode</label>
              <select
                className="mgr-select text-xs"
                value={row.paymentMode || 'Cash'}
                onChange={(e) => updateStudent(index, 'paymentMode', e.target.value)}
              >
                <option value="Cash">Cash Counter</option>
                <option value="UPI">UPI / QR Code</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-secondary block mb-1">Residential Address (Optional)</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="Flat / Room, Street, Landmark, City"
                value={row.address || ''}
                onChange={(e) => updateStudent(index, 'address', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

