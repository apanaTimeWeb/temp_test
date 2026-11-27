'use client';
// RESPONSIBILITY: AdminSeatMatrixSeatMatrixPage component owned by admin_seat_matrix; responsibility folder: admin_seat_matrix_components_views.

import { ADMIN_SEAT_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/api/admin_seats_matrix.query_keys';
import AdminSeatsMatrixBulkGenerateModal from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixBulkGenerateModal';
import {
  AdminSeatsMatrixFloorPlanView,
  computeSeatShiftOccupancy,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixFloorPlanView';
import { AdminSeatsMatrixHeader } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixHeader';
import { AdminSeatsMatrixKpiGrid } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixKpiGrid';
import {
  AdminSeatsMatrixSeatDetailModal,
  type SeatAllocationInput,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixSeatDetailModal';
import { ADMIN_SEAT_MATRIX_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import { generateFallbackSeatMatrix, useAdminSeatMatrixSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixSeatMatrix';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import {
  exportSeatMatrixCsvFile,
  exportSeatMatrixExcelFile,
  printSeatMatrixRosterHtml,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/utils/adminSeatsMatrixExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Clock, Filter, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const STATUS_FILTER_OPTIONS = ['all', 'free', 'occupied', 'expiring', 'maintenance'] as const;
type SeatStatusFilter = (typeof STATUS_FILTER_OPTIONS)[number];

function parseStatusFilter(value: string): SeatStatusFilter {
  return STATUS_FILTER_OPTIONS.find((item) => item === value) ?? 'all';
}

export function AdminSeatMatrixSeatMatrixPage() {
  useTranslations('ADMIN_SEAT_MATRIX');
  const isDemo = isFrontendDemoModeEnabled();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ADMIN_SEAT_MATRIX_QUERY_KEYS.list({ resource: 'seat-matrix', demo: isDemo }), [isDemo]);

  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [activeBranchFilter, setActiveBranchFilter] = useState('All Branches');
  const [activeTab, setActiveTab] = useState<(typeof ADMIN_SEAT_MATRIX_SHIFTS)[number]>('All');
  const [statusFilter, setStatusFilter] = useState<SeatStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedSeat, setSelectedSeat] = useState<AdminSeatMatrixSeatMatrixViewModel | null>(null);
  const [date] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [isBulkGenerateOpen, setIsBulkGenerateOpen] = useState(false);

  const seatMatrixQuery = useAdminSeatMatrixSeatMatrix();
  const rawSeats = seatMatrixQuery.data ?? [];
  const isPending = seatMatrixQuery.isPending;

  useEffect(() => {
    setActiveBranchFilter(!isAllBranches && selectedBranch ? selectedBranch.name : 'All Branches');
  }, [isAllBranches, selectedBranch]);

  const branchFilteredSeats = useMemo(() => {
    if (activeBranchFilter === 'All Branches') return rawSeats;
    const filterLower = activeBranchFilter.toLowerCase();
    return rawSeats.filter((seat) => {
      const bName = (seat.branchName || '').toLowerCase();
      const bId = (seat.branchId || '').toLowerCase();
      return bName.includes(filterLower) || filterLower.includes(bName) || bId.includes(filterLower);
    });
  }, [rawSeats, activeBranchFilter]);

  const visible = useMemo(() => {
    return branchFilteredSeats.filter((seat) => {
      if (activeTab !== 'All') {
        const dots = computeSeatShiftOccupancy(seat);
        if (activeTab === 'Morning' && seat.status !== 'free' && seat.status !== 'maintenance' && !dots.morning) return false;
        if (activeTab === 'Afternoon' && seat.status !== 'free' && seat.status !== 'maintenance' && !dots.afternoon) return false;
        if (activeTab === 'Evening' && seat.status !== 'free' && seat.status !== 'maintenance' && !dots.evening) return false;
        if (activeTab === 'Night' && seat.status !== 'free' && seat.status !== 'maintenance' && !dots.night) return false;
        if (activeTab === 'Full Day' && seat.status !== 'free' && seat.status !== 'maintenance' && seat.shift !== 'Full Day') return false;
      }
      if (statusFilter !== 'all' && seat.status !== statusFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const hit =
          seat.id.toLowerCase().includes(q) ||
          `s-${seat.id}`.toLowerCase().includes(q) ||
          Boolean(seat.student?.toLowerCase().includes(q)) ||
          Boolean(seat.smartId?.toLowerCase().includes(q)) ||
          Boolean(seat.phone?.toLowerCase().includes(q)) ||
          Boolean(seat.plan?.toLowerCase().includes(q)) ||
          Boolean(seat.shift?.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [branchFilteredSeats, activeTab, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = branchFilteredSeats.length;
    const free = branchFilteredSeats.filter((s) => s.status === 'free').length;
    const occupied = branchFilteredSeats.filter((s) => s.status === 'occupied').length;
    const expiringOrMaint = branchFilteredSeats.filter((s) => s.status === 'expiring' || s.status === 'maintenance').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, free, occupied, expiringOrMaint, occupancyRate };
  }, [branchFilteredSeats]);

  const updateSeatInCache = (updatedSeat: AdminSeatMatrixSeatMatrixViewModel) => {
    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      return list.map((s) => (s.id === updatedSeat.id ? updatedSeat : s));
    });
  };

  const handleAllocateSeat = (input: SeatAllocationInput) => {
    if (!selectedSeat) return;
    const studentName = input.student.trim();
    if (!studentName) {
      toast.error('Student name is required.', { id: 'admin-seat-matrix-allocate-invalid' });
      return;
    }
    updateSeatInCache({
      ...selectedSeat,
      status: 'occupied',
      student: studentName,
      smartId: input.smartId.trim() || `SL-${selectedSeat.id}`,
      phone: input.phone.trim() || '9876543210',
      shift: input.shift,
      plan: input.plan,
      locker: input.locker.trim() || undefined,
      validFrom: format(new Date(), 'yyyy-MM-dd'),
      expiry: input.expiry,
    });
    toast.success(`Seat S-${selectedSeat.id} successfully allocated to ${studentName}`, { id: 'admin-seat-matrix-allocate' });
    setSelectedSeat(null);
  };

  const handleVacateSeat = () => {
    if (!selectedSeat) return;
    updateSeatInCache({
      ...selectedSeat,
      status: 'free',
      student: undefined,
      smartId: undefined,
      phone: undefined,
      shift: undefined,
      plan: undefined,
      locker: undefined,
      validFrom: undefined,
      expiry: undefined,
    });
    toast.success(`Seat S-${selectedSeat.id} vacated and marked available`, { id: 'admin-seat-matrix-vacate' });
    setSelectedSeat(null);
  };

  const handleToggleMaintenance = (targetStatus: 'maintenance' | 'free') => {
    if (!selectedSeat) return;
    updateSeatInCache({
      ...selectedSeat,
      status: targetStatus,
      student: targetStatus === 'free' ? undefined : selectedSeat.student,
    });
    if (targetStatus === 'maintenance') {
      toast.info(`Seat S-${selectedSeat.id} marked as under maintenance`, { id: 'admin-seat-matrix-maint' });
    } else {
      toast.success(`Seat S-${selectedSeat.id} maintenance resolved. Marked available`, { id: 'admin-seat-matrix-maint' });
    }
    setSelectedSeat(null);
  };

  const handleQuickShiftChange = (nextShift: string) => {
    if (!selectedSeat) return;
    const updatedSeat: AdminSeatMatrixSeatMatrixViewModel = { ...selectedSeat, shift: nextShift };
    updateSeatInCache(updatedSeat);
    toast.success(`Shift for Seat S-${selectedSeat.id} updated to ${nextShift}`, { id: 'admin-seat-matrix-shift-update' });
    setSelectedSeat(updatedSeat);
  };

  const handleBulkGenerateSeats = (newSeats: AdminSeatMatrixSeatMatrixViewModel[]) => {
    queryClient.setQueryData<AdminSeatMatrixSeatMatrixViewModel[]>(queryKey, (current) => {
      const list = current && current.length > 0 ? current : generateFallbackSeatMatrix();
      const existingIds = new Set(list.map((s) => s.id));
      return [...list, ...newSeats.filter((s) => !existingIds.has(s.id))];
    });
  };

  return (
    <div className="min-w-0 space-y-6">
      <AdminSeatsMatrixHeader
        activeBranchFilter={activeBranchFilter}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        onOpenBulkGenerate={() => setIsBulkGenerateOpen(true)}
        onExportCsv={() => exportSeatMatrixCsvFile(visible, activeBranchFilter, date)}
        onExportExcel={() => exportSeatMatrixExcelFile(visible, activeBranchFilter, date)}
        onPrintRoster={() => printSeatMatrixRosterHtml(visible, activeBranchFilter, stats)}
      />

      <AdminSeatsMatrixKpiGrid {...stats} activeBranchFilter={activeBranchFilter} />

      <div className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Seat Shifts">
            {ADMIN_SEAT_MATRIX_SHIFTS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold motion-safe:transition-colors ${
                    isSelected ? 'bg-primary text-on-primary shadow-card' : 'border border-border bg-surface-highlight text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'All' ? 'All Shifts' : tab}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-text-secondary font-medium flex items-center gap-2">
            <Clock size={14} className="text-primary" aria-hidden="true" />
            <span>Shift Timings: M (08–12) • A (12–16) • E (16–20) • N (20–06)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(parseStatusFilter(e.target.value))}
                aria-label="Filter seats by status"
                className="pl-8 pr-7 py-2 text-xs rounded-xl border border-border bg-input text-text-primary font-semibold focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Statuses ({branchFilteredSeats.length})</option>
                <option value="free">Available Free ({branchFilteredSeats.filter((s) => s.status === 'free').length})</option>
                <option value="occupied">Occupied Only ({branchFilteredSeats.filter((s) => s.status === 'occupied').length})</option>
                <option value="expiring">Expiring Soon ({branchFilteredSeats.filter((s) => s.status === 'expiring').length})</option>
                <option value="maintenance">Maintenance ({branchFilteredSeats.filter((s) => s.status === 'maintenance').length})</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" aria-hidden="true" />
              <input
                maxLength={100}
                type="text"
                placeholder="Search seat (S-01), student, phone, plan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-border bg-input text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                  <X size={13} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-highlight text-text-secondary border border-border">
            Showing {visible.length} of {branchFilteredSeats.length} Desks
          </span>
        </div>
      </div>

      <AdminSeatsMatrixFloorPlanView
        viewMode={viewMode}
        isPending={isPending}
        visible={visible}
        activeBranchFilter={activeBranchFilter}
        onSelectSeat={setSelectedSeat}
      />

      <AdminSeatsMatrixSeatDetailModal selectedSeat={selectedSeat} onClose={() => setSelectedSeat(null)} onAllocate={handleAllocateSeat} onVacate={handleVacateSeat} onToggleMaintenance={handleToggleMaintenance} onQuickShiftChange={handleQuickShiftChange} />

      <AdminSeatsMatrixBulkGenerateModal
        isOpen={isBulkGenerateOpen}
        onClose={() => setIsBulkGenerateOpen(false)}
        onGenerate={handleBulkGenerateSeats}
        defaultBranchName={selectedBranch?.name || (activeBranchFilter !== 'All Branches' ? activeBranchFilter : 'Downtown Central')}
        existingSeatIds={rawSeats.map((s) => s.id)}
      />
    </div>
  );
}

export default AdminSeatMatrixSeatMatrixPage;
