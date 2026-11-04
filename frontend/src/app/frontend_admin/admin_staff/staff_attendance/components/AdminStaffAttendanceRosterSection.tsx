'use client';

import { useTranslations } from 'next-intl';
import {
  Sun,
  Sunset,
  Moon,
  Building2,
  Calendar,
  UserCheck,
  Shield,
  Check,
  X,
  Clock,
  UserX,
} from 'lucide-react';
import type {
  StaffRosterSlot,
  StaffLeaveRequest,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';
import { ADMIN_STAFF_SHIFTS } from '@/app/frontend_admin/admin_staff/staff_attendance/config/admin_staff_attendance.url_config';

interface Props {
  slots: StaffRosterSlot[];
}

export function AdminStaffAttendanceRosterSection({ slots }: Props) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <Calendar className="h-10 w-10 text-text-disabled" />
        <h3 className="mt-3 text-base font-semibold text-text-primary">{t('ROSTER_EMPTY_TITLE')}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t('ROSTER_EMPTY_DESC')}</p>
      </div>
    );
  }

  const shiftIcons = {
    MORNING: Sun,
    EVENING: Sunset,
    NIGHT: Moon,
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {ADMIN_STAFF_SHIFTS.map((shiftDef) => {
        const matchingSlots = slots.filter((s) => s.shiftType === shiftDef.code);
        const Icon = shiftIcons[shiftDef.code] || Sun;

        return (
          <div key={shiftDef.id} className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
            {/* Shift Card Header */}
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{shiftDef.name}</h3>
                  <span className="text-xs text-text-disabled">{shiftDef.timing}</span>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {matchingSlots.length} Staff
              </span>
            </div>

            {/* Shift Staff List */}
            <div className="divide-y divide-border p-3 flex-1">
              {matchingSlots.length === 0 ? (
                <p className="py-6 text-center text-xs text-text-disabled">No staff assigned to this shift</p>
              ) : (
                matchingSlots.map((slot) => (
                  <div key={slot.id} className="flex items-start justify-between py-2.5 first:pt-0 last:pb-0">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{slot.staffName}</h4>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="rounded border border-border bg-surface px-1.5 py-0.2 text-[10px] font-medium text-text-secondary">
                          {slot.role}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-text-disabled">
                          <Building2 size={11} />
                          {slot.branchName}
                        </span>
                      </div>
                    </div>

                    {/* Active Days Pills */}
                    <div className="flex flex-wrap justify-end gap-1 max-w-[120px]">
                      {slot.daysActive.map((d) => (
                        <span
                          key={d}
                          className="rounded bg-surface-highlight px-1.5 py-0.5 text-[9px] font-semibold text-text-secondary"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface LeavesProps {
  leaveRequests: StaffLeaveRequest[];
  onAction: (leaveId: string, action: 'APPROVE' | 'REJECT') => void;
}

export function AdminStaffAttendanceLeavesSection({ leaveRequests, onAction }: LeavesProps) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');

  if (leaveRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <UserX className="h-10 w-10 text-text-disabled" />
        <h3 className="mt-3 text-base font-semibold text-text-primary">{t('NO_LEAVES_TITLE')}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t('NO_LEAVES_DESC')}</p>
      </div>
    );
  }

  const badgeStyles = {
    CASUAL: 'bg-info/10 text-info border-info/30',
    SICK: 'bg-warning/10 text-warning border-warning/30',
    VACATION: 'bg-primary/10 text-primary border-primary/30',
    UNPAID: 'bg-muted text-text-secondary border-border',
  };

  const statusStyles = {
    PENDING: 'bg-warning/10 text-warning border-warning/30',
    APPROVED: 'bg-success/10 text-success border-success/30',
    REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {leaveRequests.map((req) => (
          <article key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-text-primary">{req.staffName}</h4>
                <p className="text-xs text-text-secondary">{req.role} · {req.branchName}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${statusStyles[req.status]}`}>
                {req.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`rounded px-2 py-0.5 font-medium border ${badgeStyles[req.leaveType]}`}>
                {req.leaveType}
              </span>
              <span className="text-text-secondary">
                {req.startDate} to {req.endDate} ({req.daysCount} days)
              </span>
            </div>

            <p className="text-xs text-text-secondary bg-surface p-2 rounded-md border border-border">
              &quot;{req.reason}&quot;
            </p>

            {req.status === 'PENDING' && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onAction(req.id, 'APPROVE')}
                  className="flex-1 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary hover:bg-primary-hover transition-colors"
                >
                  <Check size={14} />
                  {t('ACTION_APPROVE_LEAVE')}
                </button>
                <button
                  type="button"
                  onClick={() => onAction(req.id, 'REJECT')}
                  className="flex-1 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <X size={14} />
                  {t('ACTION_REJECT_LEAVE')}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th scope="col" className="px-4 py-3">{t('COL_STAFF')}</th>
              <th scope="col" className="px-4 py-3">{t('COL_BRANCH')}</th>
              <th scope="col" className="px-4 py-3">{t('COL_LEAVE_TYPE')}</th>
              <th scope="col" className="px-4 py-3">{t('COL_DURATION')}</th>
              <th scope="col" className="px-4 py-3">{t('COL_REASON')}</th>
              <th scope="col" className="px-4 py-3">{t('COL_STATUS')}</th>
              <th scope="col" className="px-4 py-3 text-right">{t('COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leaveRequests.map((req) => (
              <tr key={req.id} className="hover:bg-surface-hover transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div>{req.staffName}</div>
                  <div className="text-xs text-text-secondary">{req.role}</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{req.branchName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium border ${badgeStyles[req.leaveType]}`}>
                    {req.leaveType}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  <div>{req.startDate} to {req.endDate}</div>
                  <div className="font-semibold text-text-primary">{req.daysCount} days</div>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary max-w-xs truncate" title={req.reason}>
                  {req.reason}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyles[req.status]}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {req.status === 'PENDING' ? (
                    <div className="flex justify-end items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAction(req.id, 'APPROVE')}
                        className="inline-flex min-h-8 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-semibold text-on-primary hover:bg-primary-hover transition-colors"
                      >
                        <Check size={13} />
                        {t('ACTION_APPROVE_LEAVE')}
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction(req.id, 'REJECT')}
                        className="inline-flex min-h-8 items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <X size={13} />
                        {t('ACTION_REJECT_LEAVE')}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-text-disabled">Decided</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStaffAttendanceRosterSection;


