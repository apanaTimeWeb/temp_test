// Responsibility: AdminAllocationsPage component owned by admin_allocations; responsibility folder: admin_allocations_components_views.
'use client';

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useLocale, useTranslations } from 'next-intl';
// RESPONSIBILITY: Entry page for the admin_allocations module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useMemo, useRef, useState } from 'react';
import { useAdminAllocationsFilters } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/hooks/useAdminAllocationsFilters';
import { ChevronDown, Download, Eye, Printer, Upload, MessageSquare, Send, Mail } from 'lucide-react';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { ColDef, DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import toast from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS, ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS, ADMIN_ALLOCATIONS_ALLOCATION_STATUS_OPTIONS } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/config/admin_allocations.url_config';
import { matchesAdminAllocationsFilter, toIsoAdminAllocationsDisplayDate } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/utils/AdminAllocationsFilterUtils';
import { ADMIN_ALLOCATIONS_DEMO_ALLOCATIONS, type AdminAllocationsDemoAllocation } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/mocks/AdminAllocationsDemoFixtures';
import { parseAdminAllocationsCsv, serializeAdminAllocationsCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/utils/AdminAllocationsCsvUtils';
import type { Allocation } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/types/AdminAllocationsTypes';


function adminAllocationsMaskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length < 4) return '••••';
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
}

function formatAllocationDate(value: string, locale: string): string {
  const iso = toIsoAdminAllocationsDisplayDate(value);
  if (!iso) return '—';
  const [year, month, day] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year!, month! - 1, day!)));
}

function renderStudentCell({ data }: { data: Allocation }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="flex min-w-0 items-center gap-2">{data.studentName}</p>
      <p className="block text-xs text-text-secondary">{data.smartId} • {adminAllocationsMaskPhone(data.phone)}</p>
    </div>
  );
}

export function AdminAllocationsPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-allocations-admin-allocations-allocations-page-1-page', 0);

  const t = useTranslations('ADMIN_ALLOCATIONS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const { shiftFilter, setShiftFilter, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo } = useAdminAllocationsFilters();
  const [allocations, setAllocations] = useState<Allocation[]>(() => [...ADMIN_ALLOCATIONS_DEMO_ALLOCATIONS]);
  const importInputRef = useRef<HTMLInputElement>(null);

  const invalidDateRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);
  const filtered = (invalidDateRange || !isDemoMode ? [] : allocations).filter(a => {
    const matchShift = matchesAdminAllocationsFilter(a.shift, shiftFilter);
    const matchStatus = matchesAdminAllocationsFilter(a.status, statusFilter);
    const validFrom = toIsoAdminAllocationsDisplayDate(a.validFrom);
    const validTill = toIsoAdminAllocationsDisplayDate(a.validTill);
    const matchFrom = !dateFrom || Boolean(validFrom && validFrom >= dateFrom);
    const matchTo = !dateTo || Boolean(validTill && validTill <= dateTo);
    return matchShift && matchStatus && matchFrom && matchTo;
  });
  const handleExportCsv = () => {
    if (!isDemoMode) return;
    const blob = new Blob([serializeAdminAllocationsCsv(filtered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-allocations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success(t('allocationExportSuccess', { count: filtered.length }), { id: 'admin_seats_shifts_lockers-allocations-components-AdminAllocationsPage-toast-73-1' });
  };

  const handleImportFile = async (file?: File) => {
    if (!file || !isDemoMode) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error(t('allocationImportInvalidFile'), { id: 'admin_seats_shifts_lockers-allocations-components-AdminAllocationsPage-toast-79-2' });
      return;
    }
    try {
      const imported = parseAdminAllocationsCsv(await file.text());
      setAllocations((current) => {
        const bySmartId = new Map(current.map((allocation) => [allocation.smartId, allocation]));
        for (const allocation of imported) bySmartId.set(allocation.smartId, allocation);
        return [...bySmartId.values()];
      });
      toast.success(t('allocationImportSuccess', { count: imported.length }), { id: 'admin_seats_shifts_lockers-allocations-components-AdminAllocationsPage-toast-89-3' });
    } catch {
      toast.error(t('allocationImportInvalid'), { id: 'admin_seats_shifts_lockers-allocations-components-AdminAllocationsPage-toast-91-4' });
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };

  const colDefs = useMemo<readonly DataGridColumn<Allocation>[]>(() => [
    { field: 'studentName', headerName: t('student').toUpperCase(), flex: 2, minWidth: 200, cellRenderer: renderStudentCell },
    { field: 'seatNo', headerName: `${t('seat').toUpperCase()} #`, flex: 0.8, cellClass: 'font-mono text-sm font-semibold text-primary' },
    { field: 'shift', headerName: t('shift').toUpperCase(), flex: 1, cellClass: 'text-sm text-text-secondary' },
    { field: 'customSlots', headerName: t('customSlots').toUpperCase(), flex: 1.5, cellClass: 'text-sm text-text-secondary' },
    { field: 'lockerNo', headerName: `${t('locker').toUpperCase()} #`, flex: 0.8, cellClass: 'text-sm text-text-secondary' },
    { field: 'feeStatus', headerName: t('fee').toUpperCase(), flex: 0.8, cellRenderer: ({ value }: { value: string }) => <span data-testid="admin_allocations-page-state-006" className={ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS[value as keyof typeof ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>{value === 'Paid' ? t('paid') : t('due')}</span> },
    { field: 'validFrom', headerName: t('validFrom').toUpperCase(), flex: 1.2, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ value }) => formatAllocationDate(String(value ?? ''), locale) },
    { field: 'validTill', headerName: t('till').toUpperCase(), flex: 1.2, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ value }) => formatAllocationDate(String(value ?? ''), locale) },
    { field: 'daysLeft', headerName: t('daysLeftHeader').toUpperCase(), flex: 1, cellRenderer: ({ value }: { value: number }) => value < 0 ? <span data-testid="admin_allocations-page-state-001" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text">{t('daysAgo', { count: Math.abs(value) })}</span> : value <= 7 ? <span data-testid="admin_allocations-page-state-002" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text">{t('daysLeft', { count: value })}</span> : value <= 15 ? <span data-testid="admin_allocations-page-state-003" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text">{t('daysLeft', { count: value })}</span> : <span data-testid="admin_allocations-page-state-004" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text">{t('daysLeft', { count: value })}</span> },
    { field: 'status', headerName: t('status').toUpperCase(), flex: 1, cellRenderer: ({ value }: { value: string }) => <span data-testid="admin_allocations-page-state-005" className={ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS[value as keyof typeof ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}><span className="mr-1.5 inline-block size-1.5 shrink-0 rounded-full bg-current align-middle" />{value === 'Active' ? t('active') : value === 'Expired' ? t('expired') : t('suspended')}</span> },
    { headerName: t('actions').toUpperCase(), flex: 0.8, sortable: false, cellRenderer: () => <div className="flex flex-wrap items-center justify-end gap-2"><button type="button" data-testid="admin_allocations-page-control-007" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-secondary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" aria-label={t('viewStudent')} disabled title={t('allocationStudentDetailUnavailable')}><Eye size={18} strokeWidth={2}/></button></div> },
  ], [locale, t]);

  return (
    <>

      <div className="min-w-0 space-y-6">
        {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('liveAllocationNotice')}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">{t('allocationsTitle')}</h1>
            <p className="text-sm text-text-secondary">{t('allocationsSubtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 admin-shared-action-row" >
            <input ref={importInputRef} className="sr-only" type="file" accept=".csv,text/csv" aria-label={t('allocationImportFileLabel')} onChange={(event) => void handleImportFile(event.target.files?.[0])} />
            <button type="button" data-testid="admin_allocations-page-control-008" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start" disabled={!isDemoMode} title={!isDemoMode ? t('allocationDemoOnly') : undefined} onClick={() => importInputRef.current?.click()}>
              <Upload size={18} strokeWidth={2}/>{t('import')}</button>
            <button type="button" data-testid="admin_allocations-page-control-009" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start" disabled={!isDemoMode} title={!isDemoMode ? t('allocationDemoOnly') : undefined} onClick={handleExportCsv}>
              <Download size={18} strokeWidth={2}/>{t('csv')}</button>
            <button type="button" data-testid="admin_allocations-page-control-010" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start" disabled={!isDemoMode} title={!isDemoMode ? t('allocationDemoOnly') : undefined} onClick={() => window.print()}>
              <Printer size={18} strokeWidth={2}/>{t('print')}</button>
            <button type="button" data-testid="admin_allocations-page-control-011" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start admin-shared-text-success"  disabled title={t('allocationWhatsAppUnavailable')}>
              <MessageSquare size={18} strokeWidth={2}/>{t('whatsApp')}</button>
            <button type="button" data-testid="admin_allocations-page-control-012" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start admin-shared-text-info"  disabled title={t('allocationTelegramUnavailable')}>
              <Send size={18} strokeWidth={2}/>{t('telegram')}</button>
            <button type="button" data-testid="admin_allocations-page-control-013" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start admin-shared-text-primary"  disabled title={t('allocationEmailUnavailable')}>
              <Mail size={18} strokeWidth={2}/>{t('email')}</button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-56">
            <select aria-label={t('shift')} data-testid="admin_allocations-page-control-014" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option value="all">{t('allShifts')}</option>
              <option value="Morning">{t('morning')}</option>
              <option value="Evening">{t('evening')}</option>
              <option value="Full Day">{t('fullDay')}</option>
            </select>
            <ChevronDown size={18} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          <div className="relative min-w-0 sm:w-56">
            <select aria-label={t('status')} data-testid="admin_allocations-page-control-015" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">{t('allStatuses')}</option>
              {ADMIN_ALLOCATIONS_ALLOCATION_STATUS_OPTIONS.map(({ value, labelKey }) => (
                <option key={value} value={value}>{t(labelKey)}</option>
              ))}
            </select>
            <ChevronDown size={18} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          <div className="relative min-w-0 flex-1">
            <input type="date" aria-label={t('validFrom')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="relative min-w-0 flex-1">
            <input type="date" aria-label={t('validTill')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        {invalidDateRange && <p role="alert" className="text-danger-text text-sm">{t('dateRangeInvalid')}</p>}

        {filtered.length === 0 ? (
          <div data-testid="admin_allocations-page-state-016" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
            <p data-testid="admin_allocations-page-state-017" className="mb-1 text-3xl">📋</p>
            <p data-testid="admin_allocations-page-state-018" className="text-sm font-semibold text-text-primary">{t('noAllocationsFound')}</p>
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card min-h-96">
            <DataGrid rowData={filtered} columnDefs={colDefs} rowHeight={52}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
          </div>
        )}
      </div>
    </>
  );
}
