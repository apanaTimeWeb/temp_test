'use client';

import type { ManagerAccountsSeatGapReportMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes';
import {
  MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS,
  type GapRow,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import { useLocale, useTranslations } from 'next-intl';
import { useManagerSeatGapReportCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportFormattingHook';
import { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Printer,
  Download,
  AlertTriangle,
  IndianRupee,
  Clock,
  Wrench,
  CheckCircle2,
  Eye,
  Layers,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import { ManagerAccountsSeatGapReportEmptyState } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_empty_states/ManagerAccountsSeatGapReportEmptyState';
import ManagerAccountsSeatGapReportTimeHorizonBar, {
  type ManagerSeatGapTimeHorizon,
} from './ManagerAccountsSeatGapReportTimeHorizonBar';
import { ManagerAccountsSeatGapReportToolbar } from './ManagerAccountsSeatGapReportToolbar';
import { ManagerAccountsSeatGapReportDetailsModal } from './ManagerAccountsSeatGapReportDetailsModal';
import { ManagerAccountsSeatGapReportRetargetModal } from './ManagerAccountsSeatGapReportRetargetModal';

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

type GapSortField =
  | 'seatNo'
  | 'shift'
  | 'floor'
  | 'lastOccupied'
  | 'gapDays'
  | 'revenueLoss'
  | 'status';

export default function ManagerAccountsSeatGapReportPage({ view, id }: ManagerAccountsSeatGapReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_seat_gap_report.ui');
  const locale = useLocale();
  const formatManagerSeatGapReportCurrency = useManagerSeatGapReportCurrencyFormatter();

  const [gapList, setGapList] = useState<GapRow[]>(MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS as GapRow[]);
  const [timeHorizon, setTimeHorizon] = useState<ManagerSeatGapTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<GapSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [selectedSeat, setSelectedSeat] = useState<GapRow | null>(null);
  const [retargetSeat, setRetargetSeat] = useState<GapRow | null>(null);

  const floors = useMemo(() => [...new Set(gapList.map((r) => r.floor))], [gapList]);

  const handleToggleSeatStatus = (seat: GapRow) => {
    const nextStatus = seat.status === 'vacant' ? 'maintenance' : 'vacant';
    setGapList((prev) =>
      prev.map((r) => (r.seatNo === seat.seatNo ? { ...r, status: nextStatus } : r))
    );
    if (selectedSeat && selectedSeat.seatNo === seat.seatNo) {
      setSelectedSeat({ ...selectedSeat, status: nextStatus });
    }
    toast.success(
      `Seat ${seat.seatNo} status updated to ${nextStatus === 'maintenance' ? 'UNDER MAINTENANCE' : 'VACANT & READY'}.`
    );
  };

  const handleResetFilters = () => {
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setShiftFilter('all');
    setStatusFilter('all');
    setFloorFilter('all');
    setSearchQuery('');
    setPage(0);
    toast.info('Seat gap filters reset to default.');
  };

  const timeFiltered = useMemo(() => {
    if (timeHorizon === 'all') return gapList;
    const now = new Date();
    return gapList.filter((r) => {
      const recDate = new Date(r.lastOccupied);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month')
        return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [gapList, timeHorizon, customStartDate, customEndDate]);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return timeFiltered.filter((r) => {
      const matchShift = shiftFilter === 'all' || r.shift === shiftFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchFloor = floorFilter === 'all' || r.floor === floorFilter;
      const matchQ =
        !q ||
        r.seatNo.toLowerCase().includes(q) ||
        r.floor.toLowerCase().includes(q) ||
        r.shift.toLowerCase().includes(q);
      return matchShift && matchStatus && matchFloor && matchQ;
    });
  }, [timeFiltered, shiftFilter, statusFilter, floorFilter, searchQuery]);

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
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
              numeric: true,
              sensitivity: 'base',
            });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visible, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const escapeCsv = (v: unknown) => {
    let s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Seat No',
      'Shift',
      'Floor',
      'Last Occupied Date',
      'Gap Days',
      'Revenue Loss (INR)',
      'Status',
    ]
      .map(escapeCsv)
      .join(',');

    const rows = sortedRows
      .map((r) =>
        [
          r.seatNo,
          r.shift,
          r.floor,
          r.lastOccupied,
          r.gapDays,
          (r.revenueLoss / 100).toFixed(2),
          r.status,
        ]
          .map(escapeCsv)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement('a'), {
      href: url,
      download: `seat_gap_report_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Seat gap report exported to CSV successfully.');
  };

  const totalLoss = visible.reduce((s, r) => s + r.revenueLoss, 0);
  const avgGapDays = visible.length ? Math.round(visible.reduce((s, r) => s + r.gapDays, 0) / visible.length) : 0;
  const maintenanceCount = visible.filter((r) => r.status === 'maintenance').length;
  const vacantCount = visible.filter((r) => r.status === 'vacant').length;

  const morningCount = gapList.filter((r) => r.shift === 'Morning').length;
  const afternoonCount = gapList.filter((r) => r.shift === 'Afternoon').length;
  const nightCount = gapList.filter((r) => r.shift === 'Night').length;

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
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 cursor-pointer ${
            align === 'right' ? 'ml-auto' : ''
          }`}
          aria-label={`${label}, sort ${
            isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'
          }`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              size={14}
              className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            {tManagerUi('seat_gap_report')}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Analyze vacant seat duration, vacancy revenue losses, and shift-wise gap distribution.
          </p>
        </div>

        {/* Action Buttons: Print Report, Export CSV */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Print Seat Gap Report"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Export Seat Gap Report as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Time Horizon Bar with Glowing Halos */}
      <ManagerAccountsSeatGapReportTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={(newHorizon) => {
          setTimeHorizon(newHorizon);
          setPage(0);
        }}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={visible.length}
      />

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gap Seats */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#260e19] to-rose-900/60 shadow-lg shadow-rose-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              {tManagerUi('total_gap_seats')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1 font-sans">{visible.length}</p>
            <span className="text-[11px] text-slate-400 font-medium">Unallocated vacant seats</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Estimated Revenue Loss */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {tManagerUi('revenue_loss')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
              {formatManagerSeatGapReportCurrency(totalLoss)}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Accumulated opportunity loss</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <IndianRupee size={22} />
          </div>
        </div>

        {/* Average Gap Days */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {tManagerUi('avg_gap_days')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-sans">{avgGapDays} Days</p>
            <span className="text-[11px] text-slate-400 font-medium">Mean vacancy duration</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Clock size={22} />
          </div>
        </div>

        {/* Under Maintenance */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 shadow-lg shadow-sky-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              {tManagerUi('under_maintenance')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1 font-sans">{maintenanceCount}</p>
            <span className="text-[11px] text-slate-400 font-medium">Temporarily unavailable</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Wrench size={22} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar with Segmented Shift Pills and Non-overlapping Search */}
      <ManagerAccountsSeatGapReportToolbar
        shiftFilter={shiftFilter}
        onShiftChange={(newShift) => {
          setShiftFilter(newShift);
          setPage(0);
        }}
        statusFilter={statusFilter}
        onStatusChange={(newStatus) => {
          setStatusFilter(newStatus);
          setPage(0);
        }}
        floorFilter={floorFilter}
        onFloorChange={(newFloor) => {
          setFloorFilter(newFloor);
          setPage(0);
        }}
        searchQuery={searchQuery}
        onSearchChange={(newQuery) => {
          setSearchQuery(newQuery);
          setPage(0);
        }}
        floors={floors}
        counts={{
          all: gapList.length,
          morning: morningCount,
          afternoon: afternoonCount,
          night: nightCount,
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Seat Gap Records Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface-highlight/70 text-xs uppercase text-secondary font-semibold">
                {renderSortableHeader('seatNo', tManagerUi('seat_no'), 'left')}
                {renderSortableHeader('shift', tManagerUi('shift'), 'left')}
                {renderSortableHeader('floor', tManagerUi('floor'), 'left')}
                {renderSortableHeader('lastOccupied', tManagerUi('last_occupied'), 'left')}
                {renderSortableHeader('gapDays', tManagerUi('gap_days'), 'right')}
                {renderSortableHeader('revenueLoss', tManagerUi('revenue_loss_inr'), 'right')}
                {renderSortableHeader('status', tManagerUi('status'), 'left')}
                <th scope="col" className="text-right py-3 px-4">
                  {tManagerUi('action') || 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <ManagerAccountsSeatGapReportEmptyState className="fin-empty-state">
                      <div className="fin-empty-state__icon flex justify-center py-2">
                        <span className="text-3xl">🪑</span>
                      </div>
                      <p className="fin-empty-state__title">
                        {searchQuery
                          ? 'No gap seats matching your search query.'
                          : tManagerUi('no_gap_seats_found')}
                      </p>
                    </ManagerAccountsSeatGapReportEmptyState>
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const isHighGap = r.gapDays > 20;
                  const isMidGap = r.gapDays >= 10 && r.gapDays <= 20;

                  return (
                    <tr
                      key={r.seatNo}
                      className="hover:bg-surface-hover/70 transition-colors group h-14"
                    >
                      {/* Seat Number */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-primary text-xs font-mono">
                          {r.seatNo}
                        </span>
                      </td>

                      {/* Shift */}
                      <td className="py-3 px-4 text-xs text-secondary">
                        <span className="font-medium text-primary">
                          {({
                            Morning: tManagerUi('morning'),
                            Afternoon: tManagerUi('afternoon'),
                            Night: tManagerUi('night'),
                          } as Record<string, string>)[r.shift] ?? r.shift}
                        </span>
                      </td>

                      {/* Floor */}
                      <td className="py-3 px-4 text-xs text-secondary">
                        {r.floor.toLowerCase().includes('floor') ? r.floor : `${r.floor} Floor`}
                      </td>

                      {/* Last Occupied Date */}
                      <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
                        {formatKnownIsoCalendarDate(r.lastOccupied, locale)}
                      </td>

                      {/* Gap Days */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            isHighGap
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : isMidGap
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {r.gapDays} {tManagerUi('d') || 'days'}
                        </span>
                      </td>

                      {/* Revenue Loss */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-xs text-rose-400 whitespace-nowrap">
                        {formatManagerSeatGapReportCurrency(r.revenueLoss)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            r.status === 'vacant'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {r.status === 'vacant' ? (
                            <>
                              <Clock size={12} />
                              <span>{tManagerUi('vacant')}</span>
                            </>
                          ) : (
                            <>
                              <Wrench size={12} />
                              <span>{tManagerUi('maintenance')}</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSeat(r)}
                            className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 transition-colors cursor-pointer"
                            title="View Seat Gap Details"
                            aria-label={`View details for seat ${r.seatNo}`}
                          >
                            <Eye size={15} />
                          </button>

                          {r.status === 'vacant' && (
                            <button
                              type="button"
                              onClick={() => setRetargetSeat(r)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40 shadow-xs transition-all cursor-pointer"
                              title={`Match inquiries & send offer for seat ${r.seatNo}`}
                            >
                              <Target size={12} />
                              <span>Retarget</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleSeatStatus(r)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                              r.status === 'vacant'
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'
                            }`}
                            title={
                              r.status === 'vacant'
                                ? 'Mark seat under maintenance'
                                : 'Mark seat as vacant & available'
                            }
                          >
                            {r.status === 'vacant' ? (
                              <>
                                <Wrench size={12} />
                                <span>Service</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={12} />
                                <span>Make Vacant</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalRows > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-secondary bg-surface-highlight/30">
            <span>
              Showing <strong className="text-primary font-semibold">{startItem}</strong>–
              <strong className="text-primary font-semibold">{endItem}</strong> of{' '}
              <strong className="text-primary font-semibold">{totalRows}</strong> results
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-accounts-seat-gap" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page-accounts-seat-gap"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={effectivePage <= 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Previous
                </button>
                <span className="text-xs text-secondary px-1.5">
                  Page <strong className="text-primary font-semibold">{effectivePage + 1}</strong> of{' '}
                  <strong className="text-primary font-semibold">{pageCount}</strong>
                </span>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <ManagerAccountsSeatGapReportDetailsModal
        isOpen={Boolean(selectedSeat)}
        seat={selectedSeat}
        formatCurrency={formatManagerSeatGapReportCurrency}
        onClose={() => setSelectedSeat(null)}
        onToggleStatus={handleToggleSeatStatus}
        onRetargetLeads={(s) => {
          setSelectedSeat(null);
          setRetargetSeat(s);
        }}
      />

      {/* Retarget Leads & Send WhatsApp Offer Modal */}
      <ManagerAccountsSeatGapReportRetargetModal
        isOpen={Boolean(retargetSeat)}
        seat={retargetSeat}
        onClose={() => setRetargetSeat(null)}
      />
    </div>
  );
}
