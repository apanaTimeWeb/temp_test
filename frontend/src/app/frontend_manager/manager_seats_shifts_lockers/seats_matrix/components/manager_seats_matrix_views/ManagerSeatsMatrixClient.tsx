'use client';
import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerSeatsMatrixModals } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModals';
import { ManagerSeatsMatrixGridView } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_views/ManagerSeatsMatrixGridView';
import { ManagerSeatsMatrixTableView, type SeatSortField } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_views/ManagerSeatsMatrixTableView';
import { ManagerSeatsMatrixToolbar } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_views/ManagerSeatsMatrixToolbar';
import { useManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/useManagerSeatsMatrixSeatMatrix';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { sanitizeManagerSeatMatrixCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixCsv';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// RESPONSIBILITY: Main Client view for Seat Matrix (Unified interactive map & tabular manager). Glues data hook to UI. It does not own backend persistence or cross-feature business logic.

export function ManagerSeatsMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Afternoon: 'Afternoon',
    Evening: tManagerUi('evening'),
    Night: 'Night',
    'Full Day': tManagerUi('full_day'),
  };
  const shiftLabel = (value?: string) => (value ? (shiftLabels[value] ?? value) : '—');
  const {
    isError,
    isPending,
    isFetching,
    refetch,
    visible,
    freeCount,
    activeTab,
    setActiveTab,
    selectedSeat,
    setSelectedSeat,
    updateSeat,
    addSeat,
    swapSeats,
  } = useManagerSeatsMatrix();

  const router = useRouter();
  const [profileSeat, setProfileSeat] = useState<SeatData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapSourceSeat, setSwapSourceSeat] = useState<SeatData | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SeatSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Unified filtered seats for BOTH Table View and Grid View
  const filteredSeats = useMemo(() => {
    return visible.filter((seat) => {
      // 1. Search Query filter (ID, Student Name, Smart ID, Shift)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        seat.id.toLowerCase().includes(q) ||
        `s-${seat.id}`.toLowerCase().includes(q) ||
        (seat.student && seat.student.toLowerCase().includes(q)) ||
        (seat.smartId && seat.smartId.toLowerCase().includes(q)) ||
        (seat.shift && seat.shift.toLowerCase().includes(q));

      // 2. Status filter
      const matchesStatus = statusFilter === 'all' || seat.status === statusFilter;

      // 3. Gender filter
      const matchesGender =
        genderFilter === 'all' ||
        (statusFilter === 'free' ? true : seat.student ? seat.studentGender === genderFilter : false);

      // 4. Zone / Hall filter (AC Hall A, AC Hall B, Silent Zone, Girls Cabin)
      const matchesZone =
        zoneFilter === 'all' ||
        (seat.wing && seat.wing.toLowerCase().includes(zoneFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesGender && matchesZone;
    });
  }, [visible, searchQuery, statusFilter, genderFilter, zoneFilter]);

  const filteredTableSeats = filteredSeats;
  const visibleGridSeats = filteredSeats;

  const isFiltered = Boolean(
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    genderFilter !== 'all' ||
    zoneFilter !== 'all' ||
    activeTab !== 'All'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenderFilter('all');
    setZoneFilter('all');
    setActiveTab('All');
    setPage(0);
  };

  const handleConfirmSwap = (sourceSeatId: string, targetSeatId: string, reason?: string) => {
    const success = swapSeats(sourceSeatId, targetSeatId);
    if (success) {
      toast.success(
        `Seat S-${sourceSeatId} successfully swapped with Seat S-${targetSeatId}${
          reason ? ` · ${reason}` : ''
        }`,
        { id: 'manager-seat-matrix-swap-success' }
      );
    } else {
      toast.error('Unable to swap seats. Please check allocations and try again.', {
        id: 'manager-seat-matrix-swap-error',
      });
    }
  };

  const toggleSort = (field: SeatSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTableSeats = useMemo(() => {
    if (!sortField) return filteredTableSeats;
    return [...filteredTableSeats].sort((a, b) => {
      const aVal = String(a[sortField] ?? '');
      const bVal = String(b[sortField] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredTableSeats, sortField, sortDirection]);

  const totalTablePages = Math.max(1, Math.ceil(sortedTableSeats.length / pageSize));
  const paginatedTableSeats = useMemo(() => {
    return sortedTableSeats.slice(page * pageSize, (page + 1) * pageSize);
  }, [sortedTableSeats, page, pageSize]);

  const handleExportCsv = () => {
    const headers = ['Seat No', 'Wing / Hall', 'Shift', 'Status', 'Assigned Student', 'Smart ID', 'Gender'];
    const rows = filteredTableSeats.map((s) => [
      sanitizeManagerSeatMatrixCsvCell(s.id),
      sanitizeManagerSeatMatrixCsvCell(s.wing ?? 'Ground Floor — AC Silent Reading Hall'),
      sanitizeManagerSeatMatrixCsvCell(s.shift ?? activeTab),
      sanitizeManagerSeatMatrixCsvCell(s.status),
      sanitizeManagerSeatMatrixCsvCell(s.student ?? '—'),
      sanitizeManagerSeatMatrixCsvCell(s.smartId ?? '—'),
      sanitizeManagerSeatMatrixCsvCell(s.studentGender ?? '—'),
    ]);
    const blob = new Blob([[headers.join(','), ...rows.map((r) => r.join(','))].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: `seat_matrix_${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Seat matrix exported successfully', { id: 'manager-seat-matrix-export-success' });
  };

  if (isError) {
    return (
      <section className="ss-page p-8" role="alert" aria-live="assertive">
        <p className="text-danger font-semibold">{tManagerUi('unable_to_load_the_seat_matrix')}</p>
        <p className="text-secondary mt-2">{tManagerUi('check_your_connection_and_try_again')}</p>
        <button
          type="button"
          className="mgr-btn-primary mt-4 inline-flex items-center gap-1.5"
          onClick={() => { void refetch(); }}
          disabled={isFetching}
        >
          {isFetching ? <ButtonLoader icon="grid-3x3" /> : null}
          <span>{isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</span>
        </button>
      </section>
    );
  }

  return (
    <div className="ss-page !p-0 space-y-4 w-full min-w-0">
      <ManagerSeatsMatrixToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(0);
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(0);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setPage(0);
        }}
        genderFilter={genderFilter}
        onGenderChange={(val) => {
          setGenderFilter(val);
          setPage(0);
        }}
        zoneFilter={zoneFilter}
        onZoneChange={(val) => {
          setZoneFilter(val);
          setPage(0);
        }}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        onExportCsv={handleExportCsv}
        onOpenSwapModal={() => {
          const initial = selectedSeat || visible.find((s) => s.status === 'occupied') || visible[0] || null;
          setSwapSourceSeat(initial);
          setIsSwapModalOpen(true);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* ── Dynamic Content: GRID VIEW OR TABLE VIEW ── */}
      {viewMode === 'grid' ? (
        <ManagerSeatsMatrixGridView
          visibleGridSeats={visibleGridSeats}
          isPending={isPending}
          freeCount={freeCount}
          onSelectSeat={setSelectedSeat}
          shiftLabel={shiftLabel}
          searchQuery={searchQuery}
        />
      ) : (
        <ManagerSeatsMatrixTableView
          filteredTableSeats={filteredTableSeats}
          paginatedTableSeats={paginatedTableSeats}
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setPage(0); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setPage(0); }}
          genderFilter={genderFilter}
          setGenderFilter={(val) => { setGenderFilter(val); setPage(0); }}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onSelectSeat={setSelectedSeat}
          onViewStudentProfile={setProfileSeat}
          shiftLabel={shiftLabel}
          page={page}
          pageSize={pageSize}
          totalTablePages={totalTablePages}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
        />
      )}

      <ManagerSeatsMatrixModals
        visible={visible}
        selectedSeat={selectedSeat}
        setSelectedSeat={setSelectedSeat}
        updateSeat={updateSeat}
        addSeat={addSeat}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        isSwapModalOpen={isSwapModalOpen}
        setIsSwapModalOpen={setIsSwapModalOpen}
        swapSourceSeat={swapSourceSeat}
        setSwapSourceSeat={setSwapSourceSeat}
        onConfirmSwap={handleConfirmSwap}
        profileSeat={profileSeat}
        setProfileSeat={setProfileSeat}
        onNavigateToDirectory={(url) => router.push(url)}
      />
    </div>
  );
}
