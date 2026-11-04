'use client';

import { useTranslations } from 'next-intl';
import {
  Eye,
  Edit3,
  Clock,
  Building2,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  UserX,
} from 'lucide-react';
import type { StaffAttendanceRecord } from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';
import { ATTENDANCE_STATUS_VARIANTS } from '@/app/frontend_admin/admin_staff/staff_attendance/config/admin_staff_attendance.url_config';

interface Props {
  records: StaffAttendanceRecord[];
  onInspect: (record: StaffAttendanceRecord) => void;
  onRegularize: (record: StaffAttendanceRecord) => void;
}

export function AdminStaffAttendanceLogTable({ records, onInspect, onRegularize }: Props) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <Clock className="h-10 w-10 text-text-disabled" />
        <h3 className="mt-3 text-base font-semibold text-text-primary">{t('LOGS_EMPTY_TITLE')}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t('LOGS_EMPTY_DESC')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="px-4 py-3">{t('COL_STAFF')}</th>
              <th className="px-4 py-3">{t('COL_ROLE')}</th>
              <th className="px-4 py-3">{t('COL_BRANCH')}</th>
              <th className="px-4 py-3">{t('COL_SHIFT')}</th>
              <th className="px-4 py-3">{t('COL_CLOCK_IN')}</th>
              <th className="px-4 py-3">{t('COL_CLOCK_OUT')}</th>
              <th className="px-4 py-3">{t('COL_HOURS')}</th>
              <th className="px-4 py-3">{t('COL_STATUS')}</th>
              <th className="px-4 py-3 text-right">{t('COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((r) => {
              const statusBadgeClass = ATTENDANCE_STATUS_VARIANTS[r.status] || 'bg-surface text-text-secondary';
              return (
                <tr key={r.id} className="transition-colors hover:bg-surface-hover">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>
                      <span className="font-semibold">{r.staffName}</span>
                      <span className="block text-xs text-text-secondary">{r.staffId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <span className="inline-block rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-text-primary border border-border">
                      {r.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Building2 size={13} className="text-primary" />
                      {r.branchName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <div className="text-xs">
                      <span className="font-medium text-text-primary">{r.shiftType}</span>
                      <span className="block text-text-disabled">{r.shiftTiming}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-primary">
                    {r.clockIn ? (
                      <span className="font-mono text-xs">{r.clockIn}</span>
                    ) : (
                      <span className="text-xs text-text-disabled">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-primary">
                    {r.clockOut ? (
                      <span className="font-mono text-xs">{r.clockOut}</span>
                    ) : (
                      <span className="text-xs text-text-disabled">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-primary">
                    {r.totalHours ? `${r.totalHours} hrs` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass}`}>
                      {t(`STATUS_${r.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onInspect(r)}
                        title={t('ACTION_INSPECT')}
                        aria-label={t('ACTION_INSPECT')}
                        className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRegularize(r)}
                        title={t('ACTION_REGULARIZE')}
                        aria-label={t('ACTION_REGULARIZE')}
                        className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStaffAttendanceLogTable;

