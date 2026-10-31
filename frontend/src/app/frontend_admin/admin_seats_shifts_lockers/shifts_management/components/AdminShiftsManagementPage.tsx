'use client';
// RESPONSIBILITY: AdminShiftsManagementPage component owned by admin_shifts; responsibility folder: admin_shifts_components_views.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Plus, Printer, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SHIFTS_DEMO_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/mocks/scenarios/admin_shifts_management.scenarios';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { serializeAdminShiftsCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/utils/AdminShiftsManagementCsvUtils';

/** Admin Shift overview and shift configuration. */
export function AdminShiftsManagementPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [shifts, setShifts] = useState<AdminShiftsShift[]>(() => isDemoMode ? [...ADMIN_SHIFTS_DEMO_SHIFTS] : []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('12:00');
  const [capacity, setCapacity] = useState(40);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a shift name.');
      return;
    }
    const newShift: AdminShiftsShift = {
      id: String(Date.now()),
      name: name.trim(),
      startTime,
      endTime,
      occupancy: 0,
      capacity: Number(capacity) || 40,
      active: true,
    };
    setShifts((prev) => [...prev, newShift]);
    toast.success(`Shift "${newShift.name}" added successfully.`);
    setIsAddModalOpen(false);
    setName('');
    setStartTime('06:00');
    setEndTime('12:00');
    setCapacity(40);
    setFormError(null);
  };

  const exportCsv = () => {
    if (!isDemoMode) return;
    const blob = new Blob([serializeAdminShiftsCsv(shifts)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-shifts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-w-0 space-y-6">
      {!isDemoMode && (
        <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">
          {t('liveShiftNotice')}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('shiftsTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('shiftsSubtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 admin-shared-action-row" >
          <button
            type="button"
            data-testid="admin_shifts-page-control-add-shift"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} strokeWidth={2} /> Add Shift
          </button>
          <button
            type="button"
            data-testid="admin_shifts-page-control-001"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start"
            disabled
            title={t('demoShiftImportUnavailable')}
          >
            <Upload size={18} strokeWidth={2} />{t('import')}
          </button>
          <button
            type="button"
            data-testid="admin_shifts-page-control-002"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('liveShiftNotice') : undefined}
            onClick={exportCsv}
          >
            <Download size={18} strokeWidth={2} />{t('csv')}
          </button>
          <button
            type="button"
            data-testid="admin_shifts-page-control-003"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('liveShiftNotice') : undefined}
            onClick={() => window.print()}
          >
            <Printer size={18} strokeWidth={2} />{t('print')}
          </button>
        </div>
      </div>

      {shifts.length === 0 ? (
        <div data-testid="admin_shifts-page-state-004" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
          <p data-testid="admin_shifts-page-state-005" className="mb-1 text-3xl">🕐</p>
          <p data-testid="admin_shifts-page-state-006" className="text-sm font-semibold text-text-primary">{t('noShiftsDefined')}</p>
          <p data-testid="admin_shifts-page-state-007" className="text-sm text-text-secondary">{t('noShiftsConfigured')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shifts.map((shift) => (
            <div key={shift.id} className={`min-w-0 rounded-xl border border-border bg-card p-4${!shift.active ? ' min-w-0 rounded-xl border border-border bg-card p-4' : ''}`}>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3 border-b border-border p-4">
                  <h2 className="text-section-title font-semibold text-text-primary">{shift.name}</h2>
                  <span
                    data-testid="admin_shifts-page-state-008"
                    className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium ${shift.active ? 'border-success-text bg-success-bg text-success-text' : 'border-border bg-surface-highlight text-text-secondary'}`}
                  >
                    {shift.active ? t('activeStatus') : t('inactiveStatus')}
                  </span>
                </div>
                <div className="space-y-2 rounded-lg bg-surface-highlight p-3">
                  <p className={`min-w-0 rounded-lg border border-border bg-card p-3${!shift.active ? ' min-w-0 rounded-lg border border-border bg-card p-3' : ''}`}>
                    {shift.startTime} → {shift.endTime}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-text-secondary">{t('occupancy')}</p>
                    <p className="text-sm font-semibold tabular-nums text-text-primary">
                      {t('studentsCount', { count: shift.occupancy })}
                      <span className="font-mono text-xs text-text-secondary"> / {shift.capacity}</span>
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-highlight">
                    <div className={`h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-base admin-dynamic-width-${Math.min(100, Math.max(0, Math.round((shift.occupancy / Math.max(1, shift.capacity)) * 100)))}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="add-shift-dialog-title">
          <div className="admin-card w-full max-w-lg bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 id="add-shift-dialog-title" className="text-lg font-semibold text-text-primary">Add New Shift</h2>
              <button
                type="button"
                className="rounded-md p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => { setIsAddModalOpen(false); setFormError(null); }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddShift} className="mt-4 space-y-4">
              {formError && (
                <p role="alert" className="text-sm text-danger-text">{formError}</p>
              )}
              <div className="space-y-1">
                <label htmlFor="shift-name-input" className="text-sm font-medium text-text-primary">Shift Name</label>
                <input
                  id="shift-name-input"
                  type="text"
                  required
                  placeholder="e.g. Night Shift / Early Morning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="shift-start-time" className="text-sm font-medium text-text-primary">Start Time</label>
                  <input
                    id="shift-start-time"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="admin-input w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="shift-end-time" className="text-sm font-medium text-text-primary">End Time</label>
                  <input
                    id="shift-end-time"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="admin-input w-full"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="shift-capacity" className="text-sm font-medium text-text-primary">Total Capacity (Seats)</label>
                <input
                  id="shift-capacity"
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="admin-input w-full"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  className="admin-btn-ghost min-h-11"
                  onClick={() => { setIsAddModalOpen(false); setFormError(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary min-h-11"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
