'use client';
import { ALL_SEAT_OPTIONS } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionAdjacentSeats';
import { Trash2 } from 'lucide-react';
import type { GroupStudentEntry } from './ManagerMembersGroupAdmissionManualModal';

interface ManagerMembersGroupAdmissionTableViewProps {
  manualRows: GroupStudentEntry[];
  updateStudent: (index: number, field: keyof GroupStudentEntry, value: string) => void;
  removeStudent: (index: number) => void;
  shiftOptions: string[];
  planOptions: string[];
}

export function ManagerMembersGroupAdmissionTableView({
  manualRows,
  updateStudent,
  removeStudent,
  shiftOptions,
  planOptions,
}: ManagerMembersGroupAdmissionTableViewProps) {
  return (
    <div className="border border-border rounded-xl overflow-x-auto w-full">
      <table className="w-full text-xs min-w-[720px]">
        <thead className="bg-surface-highlight border-b border-border text-left font-bold text-secondary uppercase sticky top-0">
          <tr>
            <th className="p-2.5 w-10">#</th>
            <th className="p-2.5 min-w-[160px]">Student Name *</th>
            <th className="p-2.5 min-w-[140px]">Phone (10-digit) *</th>
            <th className="p-2.5 min-w-[100px]">Gender</th>
            <th className="p-2.5 min-w-[160px]">Shift</th>
            <th className="p-2.5 min-w-[150px]">Plan</th>
            <th className="p-2.5 min-w-[120px]">Assigned Seat</th>
            <th className="p-2.5 text-center w-16">Action</th>
          </tr>
        </thead>
        <tbody>
          {manualRows.map((row, index) => {
            const isNameBad = row.name.length > 0 && row.name.trim().length < 2;
            const isPhoneBad =
              row.phone.length > 0 && (!/^[6-9]/.test(row.phone) || row.phone.length < 10);

            return (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                <td className="p-2.5 font-bold text-secondary">{index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    maxLength={50}
                    className={`mgr-input py-1.5 text-xs ${isNameBad ? 'border-danger focus:border-danger' : ''}`}
                    placeholder="Full Name"
                    value={row.name}
                    onChange={(e) =>
                      updateStudent(
                        index,
                        'name',
                        e.target.value.replace(/[^a-zA-Z\s.-]/g, '').slice(0, 50)
                      )
                    }
                    title={isNameBad ? 'Min 2 characters required' : undefined}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    className={`mgr-input py-1.5 text-xs font-mono ${isPhoneBad ? 'border-danger focus:border-danger' : ''}`}
                    placeholder="9876543210"
                    value={row.phone}
                    onChange={(e) =>
                      updateStudent(
                        index,
                        'phone',
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                    title={
                      isPhoneBad
                        ? '10-digit phone number starting with 6-9 required'
                        : undefined
                    }
                  />
                </td>
                <td className="p-2">
                  <select
                    className="mgr-select py-1.5 text-xs"
                    value={row.gender}
                    onChange={(e) => updateStudent(index, 'gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="mgr-select py-1.5 text-xs"
                    value={row.shift}
                    onChange={(e) => updateStudent(index, 'shift', e.target.value)}
                  >
                    {shiftOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="mgr-select py-1.5 text-xs"
                    value={row.plan}
                    onChange={(e) => updateStudent(index, 'plan', e.target.value)}
                  >
                    {planOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="mgr-select py-1.5 text-xs font-mono font-medium"
                    value={row.seatPreference || `S-${String(index + 1).padStart(2, '0')}`}
                    onChange={(e) => updateStudent(index, 'seatPreference', e.target.value)}
                  >
                    <option value="Any Seat">Any Seat</option>
                    {ALL_SEAT_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeStudent(index)}
                    disabled={manualRows.length <= 1}
                    className="text-danger hover:text-danger-text disabled:opacity-30 p-1.5 rounded"
                    title="Remove Student"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

