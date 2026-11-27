'use client';

import { ManagerAccountsSeatGapReportDetailsModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportDetailsModal';
import { ManagerAccountsSeatGapReportKpis } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportKpis';
import { ManagerAccountsSeatGapReportRetargetModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportRetargetModal';
import {
  ManagerAccountsSeatGapReportTable,
  type GapSortField,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportTable';
import ManagerAccountsSeatGapReportTimeHorizonBar, {
  type ManagerSeatGapTimeHorizon,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportTimeHorizonBar';
import { ManagerAccountsSeatGapReportToolbar } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportToolbar';
import {
  MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS,
  type GapRow,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import { useManagerSeatGapReportCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportFormattingHook';
import type { ManagerAccountsSeatGapReportMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes';
import {
  exportSeatGapReportCsv,
  filterGapRowsByTimeHorizon,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/utils/ManagerAccountsSeatGapReportHelpers';
import { Download, Printer } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

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
  const [selectedSeat, setSelectedSeat] = useState<GapRow | null>(null);
  const [retargetSeat, setRetargetSeat] = useState<GapRow | null>(null);

  const floors = useMemo(() => [...new Set(gapList.map((r) => r.floor))], [gapList]);

  const handleToggleSeatStatus = (seat: GapRow) => {
    const nextStatus = seat.status === 'vacant' ? 'maintenance' : 'vacant';
    setGapList((prev) => prev.map((r) => (r.seatNo === seat.seatNo ? { ...r, status: nextStatus } : r)));
    if (selectedSeat && selectedSeat.seatNo === seat.seatNo) {
      setSelectedSeat({ ...selectedSeat, status: nextStatus });
    }
    toast.success(
      `Seat ${seat.seatNo} status updated to ${nextStatus === 'maintenance' ? 'UNDER MAINTENANCE' : 'VACANT & READY'}.`,
      { id: `manager-seat-gap-toggle-${seat.seatNo}` }
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
    toast.info('Seat gap filters reset to default.', { id: 'manager-seat-gap-reset-filters' });
  };

  const timeFiltered = useMemo(
    () => filterGapRowsByTimeHorizon(gapList, timeHorizon, customStartDate, customEndDate),
    [gapList, timeHorizon, customStartDate, customEndDate]
  );

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return timeFiltered.filter((r) => {
      const matchShift = shiftFilter === 'all' || r.shift === shiftFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchFloor = floorFilter === 'all' || r.floor === floorFilter;
      const matchQ = !q || r.seatNo.toLowerCase().includes(q) || r.floor.toLowerCase().includes(q) || r.shift.toLowerCase().includes(q);
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

  const handleExportCsv = () => {
    exportSeatGapReportCsv(sortedRows);
    toast.success('Seat gap report exported to CSV successfully.', { id: 'manager-seat-gap-export-csv' });
  };

  const totalLoss = visible.reduce((s, r) => s + r.revenueLoss, 0);
  const avgGapDays = visible.length ? Math.round(visible.reduce((s, r) => s + r.gapDays, 0) / visible.length) : 0;
  const maintenanceCount = visible.filter((r) => r.status === 'maintenance').length;

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">{tManagerUi('seat_gap_report')}</h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Analyze vacant seat duration, vacancy revenue losses, and shift-wise gap distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Print Seat Gap Report"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Export Seat Gap Report as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

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

      <ManagerAccountsSeatGapReportKpis
        visibleCount={visible.length}
        totalLossFormatted={formatManagerSeatGapReportCurrency(totalLoss)}
        avgGapDays={avgGapDays}
        maintenanceCount={maintenanceCount}
        labels={{
          totalGapSeats: tManagerUi('total_gap_seats'),
          revenueLoss: tManagerUi('revenue_loss'),
          avgGapDays: tManagerUi('avg_gap_days'),
          underMaintenance: tManagerUi('under_maintenance'),
        }}
      />

      <ManagerAccountsSeatGapReportToolbar
        shiftFilter={shiftFilter}
        onShiftChange={(newShift) => { setShiftFilter(newShift); setPage(0); }}
        statusFilter={statusFilter}
        onStatusChange={(newStatus) => { setStatusFilter(newStatus); setPage(0); }}
        floorFilter={floorFilter}
        onFloorChange={(newFloor) => { setFloorFilter(newFloor); setPage(0); }}
        searchQuery={searchQuery}
        onSearchChange={(newQuery) => { setSearchQuery(newQuery); setPage(0); }}
        floors={floors}
        counts={{
          all: gapList.length,
          morning: gapList.filter((r) => r.shift === 'Morning').length,
          afternoon: gapList.filter((r) => r.shift === 'Afternoon').length,
          night: gapList.filter((r) => r.shift === 'Night').length,
        }}
        onResetFilters={handleResetFilters}
      />

      <ManagerAccountsSeatGapReportTable
        paginated={paginated}
        visibleCount={visible.length}
        totalRows={totalRows}
        startItem={startItem}
        endItem={endItem}
        effectivePage={effectivePage}
        pageCount={pageCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        searchQuery={searchQuery}
        locale={locale}
        formatCurrency={formatManagerSeatGapReportCurrency}
        onViewSeat={setSelectedSeat}
        onRetargetSeat={setRetargetSeat}
        onToggleSeatStatus={handleToggleSeatStatus}
        tManagerUi={tManagerUi}
      />

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

      <ManagerAccountsSeatGapReportRetargetModal isOpen={Boolean(retargetSeat)} seat={retargetSeat} onClose={() => setRetargetSeat(null)} />
    </div>
  );
}
