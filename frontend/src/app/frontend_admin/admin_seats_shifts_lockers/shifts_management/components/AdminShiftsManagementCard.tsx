'use client';

import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { Building2, Clock, Edit3, IndianRupee, Moon, Power, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

function getShiftDurationHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  let diff = (eH * 60 + eM) - (sH * 60 + sM);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

function isShiftOvernight(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  return (eH * 60 + eM) <= (sH * 60 + sM);
}

function getBranchBadgeClass(branchName?: string): string {
  if (!branchName) return 'border-info bg-info-bg text-info-text';
  const lower = branchName.toLowerCase();
  if (lower.includes('downtown')) return 'border-border-focus bg-primary-subtle text-primary';
  if (lower.includes('westside')) return 'border-success bg-success-bg text-success-text';
  if (lower.includes('north')) return 'border-purple-text bg-purple-bg text-purple-text';
  return 'border-info bg-info-bg text-info-text';
}

interface AdminShiftsManagementCardProps {
  shift: AdminShiftsShift;
  onEdit: (shift: AdminShiftsShift) => void;
  onToggleActive: (shiftId: string) => void;
  onDelete: (shiftId: string) => void;
}

export function AdminShiftsManagementCard({
  shift,
  onEdit,
  onToggleActive,
  onDelete,
}: AdminShiftsManagementCardProps) {
  const t = useTranslations('ADMIN_SHIFTS');
  const duration = getShiftDurationHours(shift.startTime, shift.endTime);
  const overnight = isShiftOvernight(shift.startTime, shift.endTime);
  const branchBadgeClass = getBranchBadgeClass(shift.branchName);

  return (
    <div className={`min-w-0 rounded-xl border border-border bg-card p-4 motion-safe:transition-colors hover:border-border-focus${!shift.active ? ' opacity-75' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-text-primary">{shift.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              {shift.branchName && (
                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${branchBadgeClass}`}>
                  <Building2 size={11} className="shrink-0" aria-hidden="true" />
                  <span>{shift.branchName}</span>
                </span>
              )}
              {overnight && (
                <span className="inline-flex items-center gap-0.5 rounded-md border border-purple-text bg-purple-bg px-1.5 py-0.5 text-[10px] font-semibold text-purple-text">
                  <Moon size={10} aria-hidden="true" /> Overnight
                </span>
              )}
            </div>
          </div>
          <span
            data-testid="admin_shifts-page-state-008"
            className={`inline-flex min-h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              shift.active ? 'border-success-text bg-success-bg text-success-text' : 'border-border bg-surface-highlight text-text-secondary'
            }`}
          >
            {shift.active ? t('activeStatus') : t('inactiveStatus')}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-highlight p-3">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-text-primary flex items-center gap-1.5">
              <Clock size={13} className="text-primary" aria-hidden="true" />
              <span>{shift.startTime} → {shift.endTime}</span>
            </p>
            <p className="text-[11px] text-text-secondary font-mono mt-0.5">{duration} Hours Duration</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-bold text-primary shadow-card">
            <IndianRupee size={12} aria-hidden="true" />
            <span>{shift.monthlyPrice ?? 700} / mo</span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            <p className="text-xs text-text-secondary">{t('occupancy')}</p>
            <p className="text-sm font-semibold tabular-nums text-text-primary">
              {t('studentsCount', { count: shift.occupancy })}
              <span className="font-mono text-xs text-text-secondary"> / {shift.capacity} Desks</span>
            </p>
          </div>
          <div className="w-24 h-2 overflow-hidden rounded-full bg-surface-highlight">
            <div
              className={`h-full rounded-full bg-primary motion-safe:transition-[width] admin-dynamic-width-${Math.min(100, Math.max(0, Math.round((shift.occupancy / Math.max(1, shift.capacity)) * 100)))}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(shift)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border-focus bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
              title="Edit shift timetable or monthly price"
            >
              <Edit3 size={13} aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleActive(shift.id)}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold motion-safe:transition-opacity hover:opacity-90 cursor-pointer ${
                shift.active ? 'border-warning bg-warning-bg text-warning-text' : 'border-success bg-success-bg text-success-text'
              }`}
              title={shift.active ? 'Deactivate shift' : 'Activate shift'}
            >
              <Power size={13} aria-hidden="true" />
              <span>{shift.active ? 'Deactivate' : 'Activate'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onDelete(shift.id)}
            aria-label={`Delete shift ${shift.name}`}
            className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-danger bg-danger-bg text-danger-text hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
            title={`Delete shift ${shift.name}`}
          >
            <Trash2 size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
