'use client';

import { useTranslations } from 'next-intl';
import {
  Sun,
  Sunset,
  Moon,
  Building2,
  Calendar,
} from 'lucide-react';
import type {
  StaffRosterSlot,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';
import { ADMIN_STAFF_SHIFTS } from '@/app/frontend_admin/admin_staff/staff_attendance/config/admin_staff_attendance.url_config';
import { AdminStaffAttendanceLeavesSection } from './AdminStaffAttendanceLeavesSection';

export { AdminStaffAttendanceLeavesSection };

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
              <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary">
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

export default AdminStaffAttendanceRosterSection;
