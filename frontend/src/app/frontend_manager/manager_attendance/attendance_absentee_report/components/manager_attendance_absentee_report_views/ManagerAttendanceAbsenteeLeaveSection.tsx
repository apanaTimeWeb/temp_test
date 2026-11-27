'use client';

import { FileText } from 'lucide-react';
import { useState } from 'react';

const LEAVE_PRESETS = [
  'Visiting Village / Hometown (10 Days)',
  'Medical Leave / Health Illness',
  'College / Competitive Exam',
  'Family Emergency',
  'Out of Station Travel',
  'Official Leave Request Approved',
];

interface ManagerAttendanceAbsenteeLeaveSectionProps {
  smartId: string;
  excused?: boolean;
  leaveReason?: string;
  onMarkExcused?: (smartId: string, reason: string, duration?: string) => void;
  onRevokeExcused?: (smartId: string) => void;
}

export function ManagerAttendanceAbsenteeLeaveSection({
  smartId,
  excused,
  leaveReason,
  onMarkExcused,
  onRevokeExcused,
}: ManagerAttendanceAbsenteeLeaveSectionProps) {
  const [selectedReason, setSelectedReason] = useState(LEAVE_PRESETS[0]);
  const [leaveDays, setLeaveDays] = useState('10');
  const [isAddingLeave, setIsAddingLeave] = useState(false);

  return (
    <div className="p-3.5 rounded-xl bg-surface-highlight/40 border border-border space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-primary flex items-center gap-1.5">
          <FileText size={13} className="text-primary" />
          Administrative Leave Approval
        </span>
        {excused ? (
          <button
            type="button"
            onClick={() => onRevokeExcused?.(smartId)}
            className="text-[11px] text-rose-400 hover:underline cursor-pointer"
          >
            Revoke Excused Status
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingLeave((prev) => !prev)}
            className="text-[11px] text-primary hover:underline cursor-pointer"
          >
            {isAddingLeave ? 'Cancel' : '+ Mark as Excused Leave'}
          </button>
        )}
      </div>

      {excused ? (
        <p className="text-[11px] text-secondary">
          This absence is recorded as approved ({leaveReason || 'Leave Approved'}). Seat reservation will be protected against unexcused forfeiture.
        </p>
      ) : isAddingLeave ? (
        <div className="space-y-2 pt-1">
          <label htmlFor="leave-reason-select" className="text-[11px] text-secondary block">
            Select Leave Justification / Note:
          </label>
          <select
            id="leave-reason-select"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary cursor-pointer outline-none focus:border-primary"
          >
            {LEAVE_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label htmlFor="leave-days-input" className="text-[11px] text-secondary whitespace-nowrap">
              Leave Duration:
            </label>
            <input
              maxLength={30}
              id="leave-days-input"
              type="text"
              placeholder="e.g. 10 Days"
              value={leaveDays}
              onChange={(e) => setLeaveDays(e.target.value)}
              className="w-24 text-xs px-2 py-1 rounded-lg bg-card border border-border text-primary outline-none focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const finalReason = `${selectedReason}${leaveDays ? ` (${leaveDays.includes('Day') ? leaveDays : `${leaveDays} Days`})` : ''}`;
              onMarkExcused?.(smartId, finalReason, leaveDays);
              setIsAddingLeave(false);
            }}
            className="w-full text-xs py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold motion-safe:transition-colors cursor-pointer"
          >
            Approve & Mark Excused
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-secondary">
          Unexcused absences exceeding 7 days trigger seat vacancy warnings according to library regulations.
        </p>
      )}
    </div>
  );
}
