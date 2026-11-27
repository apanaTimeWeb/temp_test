'use client';
import { ManagerMembersGroupAdmissionCardExtraFields } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionCardExtraFields';
import type { GroupStudentEntry } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal';
import { ALL_SEAT_OPTIONS, isAdjacentSeat } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionAdjacentSeats';
import { Armchair, Clock, CreditCard, GraduationCap, Phone, Trash2, User } from 'lucide-react';

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
          className="p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs space-y-3 relative hover:border-primary motion-safe:transition-colors"
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
              className="text-danger hover:text-danger-text text-xs flex items-center gap-1.5 disabled:opacity-30 p-1 rounded motion-safe:transition-colors"
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-secondary">Assigned Seat *</label>
                {index > 0 && isAdjacentSeat(row.seatPreference, manualRows[index - 1]?.seatPreference || '') && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    Adjacent Pair
                  </span>
                )}
              </div>
              <div className="mgr-input-icon-wrap">
                <Armchair size={15} className="mgr-input-icon text-primary" />
                <select
                  className="mgr-select mgr-input-with-icon text-xs font-mono font-medium"
                  value={row.seatPreference || `S-${String(index + 1).padStart(2, '0')}`}
                  onChange={(e) => updateStudent(index, 'seatPreference', e.target.value)}
                >
                  <option value="Any Seat">Any Available Seat</option>
                  {ALL_SEAT_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ManagerMembersGroupAdmissionCardExtraFields
              row={row}
              index={index}
              updateStudent={updateStudent}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

