'use client';
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
                  maxLength={10}
                  className="mgr-input py-1 text-xs font-mono"
                  placeholder="9876543210"
                  value={row.phone}
                  onChange={(e) => updateStudent(index, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
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
                  <option value="Other">Other</option>
                </select>
              </td>
              <td className="p-2">
                <select
                  className="mgr-select py-1 text-xs"
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
                  className="mgr-select py-1 text-xs"
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
  );
}

