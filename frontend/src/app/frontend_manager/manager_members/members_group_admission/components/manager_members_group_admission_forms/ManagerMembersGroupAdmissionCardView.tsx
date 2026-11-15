'use client';
import {
  Trash2,
  User,
  Phone,
  GraduationCap,
  Calendar,
  Building2,
  UserCheck,
  ShieldCheck,
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  Droplet,
} from 'lucide-react';
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
          className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs space-y-3 relative hover:border-primary transition-colors"
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
              className="text-danger hover:text-danger-text text-xs flex items-center gap-1.5 disabled:opacity-30 p-1 rounded transition-colors"
            >
              <Trash2 size={14} className="text-danger shrink-0" />
              <span>Remove Form</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Full Name *</label>
              <div className="mgr-input-icon-wrap">
                <User size={15} className="mgr-input-icon text-primary" />
                <input
                  type="text"
                  maxLength={50}
                  className="mgr-input mgr-input-with-icon text-xs"
                  placeholder="e.g. Ramesh Kumar"
                  value={row.name}
                  onChange={(e) =>
                    updateStudent(
                      index,
                      'name',
                      e.target.value.replace(/[^a-zA-Z\s.-]/g, '').slice(0, 50)
                    )
                  }
                />
              </div>
              {row.name.length > 0 && row.name.trim().length < 2 && (
                <p className="text-[11px] text-danger mt-1">Min 2 letters required</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Mobile (WhatsApp) *</label>
              <div className="mgr-input-icon-wrap">
                <Phone size={15} className="mgr-input-icon text-primary" />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  className="mgr-input mgr-input-with-icon text-xs font-mono"
                  placeholder="10-digit mobile (6-9)"
                  value={row.phone}
                  onChange={(e) =>
                    updateStudent(index, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                />
              </div>
              {row.phone.length > 0 && !/^[6-9]/.test(row.phone) && (
                <p className="text-[11px] text-danger mt-1">Must start with 6, 7, 8, or 9</p>
              )}
              {row.phone.length > 0 && /^[6-9]/.test(row.phone) && row.phone.length < 10 && (
                <p className="text-[11px] text-danger mt-1">
                  {10 - row.phone.length} more digit(s) needed (10 total)
                </p>
              )}
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
              <div className="mgr-input-icon-wrap">
                <GraduationCap size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="text"
                  maxLength={60}
                  className="mgr-input mgr-input-with-icon text-xs"
                  placeholder="e.g. UPSC / NEET"
                  value={row.preparationFor}
                  onChange={(e) => updateStudent(index, 'preparationFor', e.target.value.slice(0, 60))}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-secondary block mb-1">Shift Selection (Multi-Shift Available)</label>
              <div className="mgr-input-icon-wrap">
                <Clock size={15} className="mgr-input-icon text-secondary" />
                <select
                  className="mgr-select mgr-input-with-icon text-xs font-medium"
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
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Membership Plan</label>
              <div className="mgr-input-icon-wrap">
                <CreditCard size={15} className="mgr-input-icon text-secondary" />
                <select
                  className="mgr-select mgr-input-with-icon text-xs"
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
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Date of Birth (Optional)</label>
              <div className="mgr-input-icon-wrap">
                <Calendar size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  min="1950-01-01"
                  className="mgr-input mgr-input-with-icon text-xs"
                  value={row.dob || ''}
                  onChange={(e) => updateStudent(index, 'dob', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Blood Group</label>
              <div className="mgr-input-icon-wrap">
                <Droplet size={15} className="mgr-input-icon text-danger opacity-70" />
                <select
                  className="mgr-select mgr-input-with-icon text-xs"
                  value={row.bloodGroup || ''}
                  onChange={(e) => updateStudent(index, 'bloodGroup', e.target.value)}
                >
                  <option value="">-- Select Blood Group (Optional) --</option>
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">College / Institute (Optional)</label>
              <div className="mgr-input-icon-wrap">
                <Building2 size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="text"
                  maxLength={80}
                  className="mgr-input mgr-input-with-icon text-xs"
                  placeholder="e.g. Delhi University"
                  value={row.college || ''}
                  onChange={(e) => updateStudent(index, 'college', e.target.value.slice(0, 80))}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Guardian Full Name (Optional)</label>
              <div className="mgr-input-icon-wrap">
                <UserCheck size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="text"
                  maxLength={50}
                  className="mgr-input mgr-input-with-icon text-xs"
                  placeholder="Father / Mother Name"
                  value={row.guardianName || ''}
                  onChange={(e) =>
                    updateStudent(
                      index,
                      'guardianName',
                      e.target.value.replace(/[^a-zA-Z\s.-]/g, '').slice(0, 50)
                    )
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Guardian Phone *</label>
              <div className="mgr-input-icon-wrap">
                <ShieldCheck size={15} className="mgr-input-icon text-primary" />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  className={`mgr-input mgr-input-with-icon text-xs font-mono ${
                    row.guardianPhone.length > 0 &&
                    (!/^[6-9]/.test(row.guardianPhone) ||
                      row.guardianPhone.length < 10 ||
                      (row.guardianPhone === row.phone && row.phone.length === 10))
                      ? 'border-danger focus:border-danger'
                      : ''
                  }`}
                  placeholder="10-digit mobile (6-9)"
                  value={row.guardianPhone}
                  onChange={(e) =>
                    updateStudent(index, 'guardianPhone', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                />
              </div>
              {row.guardianPhone.length > 0 && !/^[6-9]/.test(row.guardianPhone) && (
                <p className="text-[11px] text-danger mt-1">Must start with 6, 7, 8, or 9</p>
              )}
              {row.guardianPhone.length > 0 && /^[6-9]/.test(row.guardianPhone) && row.guardianPhone.length < 10 && (
                <p className="text-[11px] text-danger mt-1">
                  {10 - row.guardianPhone.length} more digit(s) needed
                </p>
              )}
              {row.guardianPhone.length === 10 && row.phone.length === 10 && row.guardianPhone === row.phone && (
                <p className="text-[11px] text-danger mt-1">Guardian number cannot be same as student mobile</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Payment Mode</label>
              <div className="mgr-input-icon-wrap">
                <Wallet size={15} className="mgr-input-icon text-secondary" />
                <select
                  className="mgr-select mgr-input-with-icon text-xs"
                  value={row.paymentMode || 'Cash'}
                  onChange={(e) => updateStudent(index, 'paymentMode', e.target.value)}
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="UPI">UPI / QR Code</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-secondary block mb-1">Residential Address (Optional)</label>
              <div className="mgr-input-icon-wrap">
                <MapPin size={15} className="mgr-input-icon text-secondary" />
                <input
                  type="text"
                  maxLength={150}
                  className="mgr-input mgr-input-with-icon text-xs"
                  placeholder="Flat / Room, Street, Landmark, City"
                  value={row.address || ''}
                  onChange={(e) => updateStudent(index, 'address', e.target.value.slice(0, 150))}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

