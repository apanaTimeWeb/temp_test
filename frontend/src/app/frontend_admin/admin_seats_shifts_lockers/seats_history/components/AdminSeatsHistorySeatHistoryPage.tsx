// Responsibility: AdminSeatsSeatHistoryPage component owned by admin_seats; responsibility folder: admin_seats_components_views.
'use client';

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useLocale, useTranslations } from 'next-intl';
import { formatAdminSeatsDate } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/utils/AdminSeatsHistoryFormatDate';
// RESPONSIBILITY: Entry page for the admin_seats module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useEffect, useMemo, useState } from 'react';
import { useAdminSeatsHistoryFilters } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/hooks/useAdminSeatsHistoryFilters';
import { ChevronDown, Search } from 'lucide-react';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { ADMIN_SEATS_SEAT_HISTORY_REASON_BADGE_CLASS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/config/admin_seats_history_constants';
import { matchesAdminSeatsFilter, toIsoAdminSeatsDisplayDate } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/utils/AdminSeatsHistoryFilterUtils';
import { ADMIN_SEATS_DEMO_SEAT_HISTORY, type AdminSeatsDemoSeatHistoryEntry } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/mocks/AdminSeatsHistoryDemoFixtures';
import type { SeatHistoryEntry } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/types/AdminSeatsHistoryTypes';


function renderSeatHistoryStudentCell({ data }: { data: SeatHistoryEntry }) {
  return <span className="flex min-w-0 items-center gap-2">{data.studentName}</span>;
}

function renderSeatHistoryReasonCell({ value, translate }: { value: string; translate: (key: string) => string }) {
  const reasonKey: Record<string, string> = { Admission: 'historyReasonAdmission', 'Shift Change': 'historyReasonShiftChange', 'Seat Change': 'historyReasonSeatChange' };
  return <span data-testid="admin_seats-page-state-001" className={ADMIN_SEATS_SEAT_HISTORY_REASON_BADGE_CLASS[value as keyof typeof ADMIN_SEATS_SEAT_HISTORY_REASON_BADGE_CLASS] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>{reasonKey[value] ? translate(reasonKey[value]) : value}</span>;
}

export function AdminSeatsSeatHistoryPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-seats-admin-seats-seat-history-page-1-page', 0);

  const t = useTranslations('ADMIN_SEATS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const { seatFilter, setSeatFilter, search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo } = useAdminSeatsHistoryFilters();
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearch]);

  const seatOptions = Array.from(new Set(ADMIN_SEATS_DEMO_SEAT_HISTORY.map((entry) => entry.seatNo))).sort((left, right) => left.localeCompare(right));
  const invalidDateRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);
  const filtered = (invalidDateRange ? [] : ADMIN_SEATS_DEMO_SEAT_HISTORY).filter(h => {
    const matchSeat = matchesAdminSeatsFilter(h.seatNo, seatFilter);
    const matchSearch = !search ||
      h.studentName.toLowerCase().includes(search.toLowerCase()) ||
      h.smartId.toLowerCase().includes(search.toLowerCase());
    const occupiedFrom = toIsoAdminSeatsDisplayDate(h.occupiedFrom);
    const occupiedTill = toIsoAdminSeatsDisplayDate(h.occupiedTill);
    const matchFrom = !dateFrom || occupiedFrom >= dateFrom;
    const matchTo = !dateTo || occupiedTill <= dateTo;
    return matchSeat && matchSearch && matchFrom && matchTo;
  });
  const colDefs = useMemo<readonly DataGridColumn<SeatHistoryEntry>[]>(() => [
    { field: 'seatNo', headerName: t('seatHistoryColumnSeat'), flex: 0.8, cellClass: 'font-mono text-sm font-semibold text-primary' },
    { field: 'studentName', headerName: t('seatHistoryColumnStudent'), flex: 1.5, cellRenderer: renderSeatHistoryStudentCell },
    { field: 'smartId', headerName: t('seatHistoryColumnSmartId'), flex: 1, cellClass: 'text-sm text-text-secondary' },
    { field: 'shift', headerName: t('seatHistoryColumnShift'), flex: 1, cellClass: 'text-sm text-text-secondary' },
    { field: 'occupiedFrom', headerName: t('seatHistoryColumnFrom'), flex: 1.3, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ value }) => formatAdminSeatsDate(String(value ?? ''), locale) },
    { field: 'occupiedTill', headerName: t('seatHistoryColumnTill'), flex: 1.3, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ value }) => formatAdminSeatsDate(String(value ?? ''), locale) },
    { field: 'duration', headerName: t('seatHistoryColumnDuration'), flex: 1, cellClass: 'text-sm text-text-secondary' },
    { field: 'reason', headerName: t('seatHistoryColumnReason'), flex: 1.3, cellRenderer: ({ value }) => renderSeatHistoryReasonCell({ value: String(value ?? ''), translate: (key) => t(key) }) },
  ], [locale, t]);

  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('seatHistoryTitle')}</h1><p role="status" className="text-warning-text">{t('seatHistoryUnavailable')}</p></section>;

  return (
    <div className="min-w-0 space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('seatHistoryTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('seatHistorySubtitle')}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 sm:w-56">
          <select aria-label={t('seatNumber')} data-testid="admin_seats-page-control-002" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={seatFilter} onChange={e => setSeatFilter(e.target.value)}>
            <option value="all">{t('allSeats')}</option>
            {seatOptions.map((seatNo) => <option key={seatNo} value={seatNo}>{seatNo}</option>)}
          </select>
          <ChevronDown size={18} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"  strokeWidth={2}/>
          <input type="text" aria-label={t('searchStudentByNameOrSmartId')} placeholder={t('searchStudentByNameOrSmartId')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div className="relative min-w-0 flex-1">
          <label htmlFor="seat-history-date-from" className="sr-only">{t('occupancyStartBefore')}</label>
          <input id="seat-history-date-from" aria-label={t('occupancyStartBefore')} type="date" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={dateFrom} max={dateTo || undefined} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div className="relative min-w-0 flex-1">
          <label htmlFor="seat-history-date-to" className="sr-only">{t('occupancyEndBefore')}</label>
          <input id="seat-history-date-to" aria-label={t('occupancyEndBefore')} type="date" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={dateTo} min={dateFrom || undefined} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      {invalidDateRange && <p role="alert" className="text-danger-text text-sm">{t('dateRangeInvalid')}</p>}
      {filtered.length === 0 ? (
        <div data-testid="admin_seats-page-state-003" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
          <p data-testid="admin_seats-page-state-004" className="mb-1 text-3xl">📜</p>
          <p data-testid="admin_seats-page-state-005" className="text-sm font-semibold text-text-primary">{t('noSeatHistory')}</p>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card min-h-96">
          <DataGrid rowData={filtered} columnDefs={colDefs} rowHeight={52}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
        </div>
      )}

    </div>
  );
}
