'use client';
// Responsibility: AdminSeatsSeatManagementMaintenancePage component owned by admin_seats; responsibility folder: admin_seats_components_views.

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useLocale, useTranslations } from 'next-intl';
import { formatAdminSeatsDate } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/utils/AdminSeatsMaintenanceFormatDate';
// RESPONSIBILITY: Entry page for the admin_seats module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminSeatsMaintenanceFormSchema, type AdminSeatsMaintenanceFormValues } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/schemas/AdminSeatsMaintenanceSchema';
import { ChevronDown, AlertTriangle, Plus } from 'lucide-react';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { ColDef, DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS, ADMIN_SEATS_SEAT_MANAGEMENT_STATUS_OPTIONS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/config/admin_seats_maintenance_constants';
import type { AdminSeatsSeatStatus } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/config/admin_seats_maintenance_constants';
import { ADMIN_SEATS_DEMO_MAINTENANCE_CURRENT_STATUS, ADMIN_SEATS_DEMO_MAINTENANCE_DAYS_SINCE, ADMIN_SEATS_DEMO_MAINTENANCE_LOGS, ADMIN_SEATS_DEMO_MAINTENANCE_SEAT_IDS, type AdminSeatsDemoMaintenanceLogEntry } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/mocks/AdminSeatsMaintenanceDemoFixtures';
import type { SeatStatus, LogEntry } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/types/AdminSeatsMaintenanceComponentTypes';


const EMPTY_FORM = { date: '', remark: '', doneBy: '', newStatus: 'Working' as SeatStatus, cost: '' };

const SEAT_STATUS_TRANSLATION_KEY: Record<SeatStatus, string> = { Working: 'working', Maintenance: 'statusMaintenance', Broken: 'broken' };

function renderSeatMaintenanceStatusBadge({ value, translate }: { value: string; translate: (key: string) => string }) {
  const status = value as SeatStatus;
  return <span data-testid="admin_seats-page-state-001" className={ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS[status] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>{SEAT_STATUS_TRANSLATION_KEY[status] ? translate(SEAT_STATUS_TRANSLATION_KEY[status]) : value}</span>;
}

export function AdminSeatsSeatManagementMaintenancePage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-seats-admin-seats-seat-management-maintenance-page-1-page', 0);

  const t = useTranslations('ADMIN_SEATS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const [selectedSeat, setSelectedSeat] = useState('S-006');
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>(isDemoMode ? ADMIN_SEATS_DEMO_MAINTENANCE_LOGS : {});
  const formMethods = useForm<AdminSeatsMaintenanceFormValues>({ resolver: zodResolver(AdminSeatsMaintenanceFormSchema), defaultValues: EMPTY_FORM, mode: 'onBlur' });
  const form = formMethods.watch();
  const errors = Object.fromEntries(Object.entries(formMethods.formState.errors).map(([key, error]) => [key, error?.message ?? ''])) as Record<string, string>;

  const currentLogs = logs[selectedSeat] ?? [];
  const daysSince = ADMIN_SEATS_DEMO_MAINTENANCE_DAYS_SINCE[selectedSeat] ?? 0;
  const showOverdue = daysSince > 30;
  const currentStatus: SeatStatus = ADMIN_SEATS_DEMO_MAINTENANCE_CURRENT_STATUS[selectedSeat] ?? 'Working';

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6">
        <h1 className="text-section-title font-semibold text-text-primary">{t('maintenanceLogTitle')}</h1>
        <p role="status" className="text-warning-text">{t('maintenanceHistoryUnavailable')}</p>
      </section>
    );
  }

  function handleAddEntry() {
    if (!isDemoMode) { toast.error(t('maintenanceLogBlocked'), { id: 'admin_seats_shifts_lockers-seats_maintenance-components-AdminSeatsMaintenanceSeatManagementMaintenancePage-toast-66-1' }); return; }
    void formMethods.handleSubmit((values) => {
      const prevStatus = currentLogs.length > 0 ? currentLogs[currentLogs.length - 1].statusAfter : currentStatus;
      const newEntry: LogEntry = {
        id: Date.now().toString(), num: currentLogs.length + 1, date: values.date,
        remark: values.remark.trim(), doneBy: values.doneBy.trim() || '—', statusBefore: prevStatus,
        statusAfter: values.newStatus, costMinor: values.cost ? Math.round(Number(values.cost) * 100) : null, currencyCode: 'INR',
      };
      setLogs(prev => ({ ...prev, [selectedSeat]: [...(prev[selectedSeat] ?? []), newEntry] }));
      formMethods.reset(EMPTY_FORM);
      toast.info(t('maintenanceLogAddedDemo'), { id: 'admin_seats_shifts_lockers-seats_maintenance-components-AdminSeatsMaintenanceSeatManagementMaintenancePage-toast-76-2' });
    })();
  }

  const colDefs = useMemo<readonly DataGridColumn<LogEntry>[]>(() => [
    { field: 'num', headerName: '#', flex: 0.5, cellClass: 'text-sm text-text-secondary' },
    { field: 'date', headerName: t('maintenanceDateColumn'), flex: 1.2, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ value }) => formatAdminSeatsDate(String(value ?? ''), locale) },
    { field: 'remark', headerName: t('maintenanceRemarkColumn'), flex: 2.5, cellClass: 'font-medium text-text-primary' },
    { field: 'doneBy', headerName: t('maintenanceDoneByColumn'), flex: 1.2, cellClass: 'text-sm text-text-secondary' },
    { field: 'statusBefore', headerName: t('statusBeforeLabel'), flex: 1.3, cellRenderer: ({ value }) => renderSeatMaintenanceStatusBadge({ value: String(value ?? ''), translate: (key) => t(key) }) },
    { field: 'statusAfter', headerName: t('statusAfterLabel'), flex: 1.3, cellRenderer: ({ value }) => renderSeatMaintenanceStatusBadge({ value: String(value ?? ''), translate: (key) => t(key) }) },
    { field: 'costMinor', headerName: t('maintenanceCostColumn'), flex: 0.8, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ data }) => data.costMinor === null ? '—' : new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: data.currencyCode }).format(data.costMinor / 100) },
  ], [locale, t]);

  return (
    <>

      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">{t('maintenanceLogTitle')}</h1>
            <p className="text-sm text-text-secondary">{t('maintenanceLogSubtitle')}</p>
          </div>
        </div>

        {/* Seat selector + status */}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-56">
            <select aria-label={t('seatNumber')} data-testid="admin_seats-page-control-002" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={selectedSeat} onChange={e => setSelectedSeat(e.target.value)}>
              {ADMIN_SEATS_DEMO_MAINTENANCE_SEAT_IDS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={18} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          <span data-testid="admin_seats-page-state-003" className={ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS[currentStatus]}>{t(SEAT_STATUS_TRANSLATION_KEY[currentStatus])}</span>
        </div>

        {/* Overdue alert */}
        {showOverdue && (
          <div className="rounded-lg border border-warning-text bg-warning-bg p-3 text-warning-text">
            <AlertTriangle size={18} className="text-warning-text"  strokeWidth={2}/>
            <span>{t('lastMaintenance')}<strong>{t('daysAgo', { count: daysSince })}</strong>{t('attentionRecommended')}</span>
          </div>
        )}

        {/* History table */}
        {currentLogs.length === 0 ? (
          <div data-testid="admin_seats-page-state-004" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
            <p data-testid="admin_seats-page-state-005" className="mb-1 text-3xl">🔧</p>
            <p data-testid="admin_seats-page-state-006" className="text-sm font-semibold text-text-primary">{t('noMaintenanceHistory')}</p>
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card min-h-80">
            <DataGrid rowData={currentLogs} columnDefs={colDefs} rowHeight={52}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
          </div>
        )}

        {/* Add New Entry form */}
        <div className="min-w-0 rounded-xl border border-border bg-card p-5">
          <h3 className="text-section-title font-semibold text-text-primary mb-4">{t('addNewEntry')}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="seat-maintenance-date" className="mb-1 block text-sm font-medium text-text-secondary">{t('date')}<span className="text-danger-text">*</span></label>
              <input id="seat-maintenance-date" type="date" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'seat-maintenance-date-error' : undefined} className={`min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60${errors.date ? ' text-danger-text' : ''}`} value={form.date} onChange={e => formMethods.setValue('date', e.target.value, { shouldDirty: true, shouldValidate: true })} />
              {errors.date && <p id="seat-maintenance-date-error" data-testid="admin_seats-page-state-007" className="rounded-lg border border-danger-text bg-danger-bg p-3 text-danger-text">{errors.date}</p>}
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="seat-maintenance-done-by" className="mb-1 block text-sm font-medium text-text-secondary">{t('doneBy')}</label>
              <input id="seat-maintenance-done-by" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" placeholder={t('technicianNamePlaceholder')} value={form.doneBy} onChange={e => formMethods.setValue('doneBy', e.target.value, { shouldDirty: true, shouldValidate: true })} />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="seat-maintenance-status" className="mb-1 block text-sm font-medium text-text-secondary">{t('newSeatStatus')}<span className="text-danger-text">*</span></label>
              <div className="relative min-w-0">
                <select id="seat-maintenance-status" data-testid="admin_seats-page-control-008" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={form.newStatus} onChange={e => formMethods.setValue('newStatus', e.target.value as SeatStatus, { shouldDirty: true, shouldValidate: true })}>
                  {ADMIN_SEATS_SEAT_MANAGEMENT_STATUS_OPTIONS.map(({ value, labelKey }) => <option key={value} value={value}>{t(labelKey)}</option>)}
                </select>
                <ChevronDown size={18} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="seat-maintenance-cost" className="mb-1 block text-sm font-medium text-text-secondary">{t('costINR')}</label>
              <input id="seat-maintenance-cost" type="number" min="0" step="0.01" aria-invalid={Boolean(errors.cost)} aria-describedby={errors.cost ? 'seat-maintenance-cost-error' : undefined} className={`min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60${errors.cost ? ' text-danger-text' : ''}`} placeholder={t('maintenanceCostPlaceholder')} value={form.cost} onChange={e => formMethods.setValue('cost', e.target.value, { shouldDirty: true, shouldValidate: true })} />
              {errors.cost && <p id="seat-maintenance-cost-error" role="alert" className="rounded-lg border border-danger-text bg-danger-bg p-3 text-danger-text">{errors.cost}</p>}
            </div>
            <div className="flex min-w-0 flex-col gap-2 col-span-full">
              <label htmlFor="seat-maintenance-remark" className="mb-1 block text-sm font-medium text-text-secondary">{t('remark')}<span className="text-danger-text">*</span></label>
              <textarea id="seat-maintenance-remark" aria-invalid={Boolean(errors.remark)} aria-describedby={errors.remark ? 'seat-maintenance-remark-error' : undefined} className={`min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60${errors.remark ? ' text-danger-text' : ''}`} rows={2} placeholder={t('maintenanceRemarkPlaceholder')} value={form.remark} onChange={e => formMethods.setValue('remark', e.target.value, { shouldDirty: true, shouldValidate: true })} />
              {errors.remark && <p id="seat-maintenance-remark-error" data-testid="admin_seats-page-state-009" className="rounded-lg border border-danger-text bg-danger-bg p-3 text-danger-text">{errors.remark}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
            <button data-testid="admin_seats-page-control-010" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleAddEntry}>
              <Plus size={18}  strokeWidth={2}/>{t('addLogEntry')}</button>
          </div>
        </div>

      </div>
    </>
  );
}
