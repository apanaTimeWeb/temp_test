'use client';
import type { ManagerAccountsSeatGapReportMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes';
import { MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import { useLocale, useTranslations } from 'next-intl';
import { useManagerSeatGapReportCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportFormattingHook';
import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ManagerAccountsSeatGapReportEmptyState } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_empty_states/ManagerAccountsSeatGapReportEmptyState';
import ManagerAccountsSeatGapReportTimeHorizonBar, { type ManagerSeatGapTimeHorizon } from './ManagerAccountsSeatGapReportTimeHorizonBar';

function formatKnownIsoCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

const MOCK = MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS;
type GapSortField = 'seatNo' | 'shift' | 'floor' | 'lastOccupied' | 'gapDays' | 'revenueLoss' | 'status';

export default function ManagerAccountsSeatGapReportPage({ view, id }: ManagerAccountsSeatGapReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_seat_gap_report.ui');
  const locale = useLocale();
  const formatManagerSeatGapReportCurrency = useManagerSeatGapReportCurrencyFormatter();
  const [timeHorizon, setTimeHorizon] = useState<ManagerSeatGapTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<GapSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const timeFiltered = useMemo(() => {
    if (timeHorizon === 'all') return MOCK;
    const now = new Date('2026-04-15T12:00:00Z');
    return MOCK.filter((r) => {
      const recDate = new Date(r.lastOccupied);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
      default: return 'All Gap Seats';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return timeFiltered.filter((r) => {
      const matchShift = shiftFilter === 'all' || r.shift === shiftFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchQ =
        !q ||
        r.seatNo.toLowerCase().includes(q) ||
        r.floor.toLowerCase().includes(q) ||
        r.shift.toLowerCase().includes(q);
      return matchShift && matchStatus && matchQ;
    });
  }, [timeFiltered, shiftFilter, statusFilter, searchQuery]);

  const toggleSort = (field: GapSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return visible;
    return [...visible].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visible, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (field: GapSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const totalLoss = visible.reduce((s, r) => s + r.revenueLoss, 0);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('seat_gap_report')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('preview_vacant_seat_gaps_and_illustrative_revenue_loss_e_8c1a45')}</p>
        <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-accounting-seat-gap-sample-warning">{tManagerUi('sample_data_only_rows_and_revenue_estimates_are_not_live_8f348a')}</p>
      </div>

      <ManagerAccountsSeatGapReportTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={visible.length}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--danger">
          <div className="flex items-center justify-between">
            <p className="fin-kpi-label fin-kpi-label--danger">{tManagerUi('total_gap_seats')}</p>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-danger border border-border">[{timeHorizonLabel}]</span>
          </div>
          <p className="fin-kpi-value fin-kpi-value--danger">{visible.length}</p>
        </div>
        <div className="fin-kpi-card fin-kpi-card--warning">
          <div className="flex items-center justify-between">
            <p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('revenue_loss')}</p>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-warning border border-border">[{timeHorizonLabel}]</span>
          </div>
          <p className="fin-kpi-value fin-kpi-value--warning">{formatManagerSeatGapReportCurrency(totalLoss)}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="flex items-center justify-between">
            <p className="fin-kpi-label">{tManagerUi('avg_gap_days')}</p>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">[{timeHorizonLabel}]</span>
          </div>
          <p className="fin-kpi-value">{visible.length ? Math.round(visible.reduce((s,r)=>s+r.gapDays,0)/visible.length) : 0}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="flex items-center justify-between">
            <p className="fin-kpi-label">{tManagerUi('under_maintenance')}</p>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-secondary border border-border">[{timeHorizonLabel}]</span>
          </div>
          <p className="fin-kpi-value">{visible.filter(r=>r.status==='maintenance').length}</p>
        </div>
      </div>

      <div className="fin-filter-bar flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search seat no, floor, or shift..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          />
        </div>
        <select className="fin-select w-40" value={shiftFilter} onChange={e => { setShiftFilter(e.target.value); setPage(0); }} aria-label={tManagerUi('all_shifts')}>
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Afternoon">{tManagerUi('afternoon')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Night">{tManagerUi('night')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
        <select className="fin-select w-40" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="vacant">{tManagerUi('vacant')}</option>
          <option value="maintenance">{tManagerUi('maintenance')}</option>
        </select>
        <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed ml-auto" disabled title={tManagerUi('official_report_export_unavailable_the_rows_are_sample_d_e79411')} data-testid="manager-accounting-seat-gap-export-disabled">{tManagerUi('export_unavailable')}</button>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              {renderSortableHeader('seatNo', tManagerUi('seat_no'))}
              {renderSortableHeader('shift', tManagerUi('shift'))}
              {renderSortableHeader('floor', tManagerUi('floor'))}
              {renderSortableHeader('lastOccupied', tManagerUi('last_occupied'))}
              {renderSortableHeader('gapDays', tManagerUi('gap_days'), 'right')}
              {renderSortableHeader('revenueLoss', tManagerUi('revenue_loss_inr'), 'right')}
              {renderSortableHeader('status', tManagerUi('status'))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><ManagerAccountsSeatGapReportEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">🪑</div><p className="fin-empty-state__title">{searchQuery ? 'No gap seats matching your search query.' : tManagerUi('no_gap_seats_found')}</p></ManagerAccountsSeatGapReportEmptyState></td></tr>
            ) : paginated.map(r => (
              <tr key={r.seatNo} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface h-12">
                <td className="py-3 px-4 fin-cell-name">{r.seatNo}</td>
                <td className="py-3 px-4 fin-cell-subtext">{({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Night: tManagerUi('night') } as Record<string, string>)[r.shift] ?? r.shift}</td>
                <td className="py-3 px-4 fin-cell-subtext">{r.floor}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatKnownIsoCalendarDate(r.lastOccupied, locale)}</td>
                <td className={`py-3 px-4 text-right font-semibold ${r.gapDays > 20 ? 'fin-text-danger' : 'fin-text-warning'}`}>{r.gapDays}{tManagerUi('d')}</td>
                <td className="py-3 px-4 text-right fin-text-danger font-semibold">{formatManagerSeatGapReportCurrency(r.revenueLoss)}</td>
                <td className="py-3 px-4">
                  <span className={`fin-badge ${r.status === 'vacant' ? 'fin-badge--warning' : 'fin-badge--danger'}`}>{r.status === 'vacant' ? tManagerUi('vacant') : r.status === 'maintenance' ? tManagerUi('maintenance') : r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalRows > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
            <span>Showing {startItem}–{endItem} of {totalRows} results</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-accounts-seat-gap" className="text-xs text-secondary whitespace-nowrap">Rows per page:</label>
                <select
                  id="rows-per-page-accounts-seat-gap"
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                  className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="mgr-btn-ghost mgr-btn-sm" disabled={effectivePage <= 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</button>
                <span className="text-xs text-secondary px-1">Page {effectivePage + 1} of {pageCount}</span>
                <button type="button" className="mgr-btn-ghost mgr-btn-sm" disabled={effectivePage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
