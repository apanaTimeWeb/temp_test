'use client';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { CalendarDays, LayoutGrid, List, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeManagerSeatMatrixCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixCsv';
import { useManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/useManagerSeatsMatrixSeatMatrix';
import { SHIFT_TABS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { ManagerSeatsMatrixModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModal';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { ManagerSeatsMatrixGridView } from './ManagerSeatsMatrixGridView';
import { ManagerSeatsMatrixTableView, type SeatSortField } from './ManagerSeatsMatrixTableView';
import { ManagerSeatsMatrixAddModal } from '../manager_seats_matrix_dialogs/ManagerSeatsMatrixAddModal';

// RESPONSIBILITY: Main Client view for Seat Matrix (Unified interactive map & tabular manager). Glues data hook to UI. It does not own backend persistence or cross-feature business logic.

export function ManagerSeatsMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Evening: tManagerUi('evening'),
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
  } = useManagerSeatsMatrix();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SeatSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filtered seats for Table View
  const filteredTableSeats = useMemo(() => {
    return visible.filter((seat) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        seat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seat.student && seat.student.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seat.smartId && seat.smartId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || seat.status === statusFilter;
      const matchesGender = genderFilter === 'all' || (seat.student ? seat.studentGender === genderFilter : true);
      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [visible, searchQuery, statusFilter, genderFilter]);

  // Filtered seats for Grid View
  const visibleGridSeats = useMemo(() => {
    if (genderFilter === 'all') return visible;
    return visible.filter((seat) => {
      if (seat.status === 'free') return true;
      return seat.studentGender === genderFilter;
    });
  }, [visible, genderFilter]);

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
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `seat_matrix_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Seat matrix exported successfully');
  };

  if (isError) {
    return (
      <section className="ss-page p-8" role="alert" aria-live="assertive">
        <p className="text-danger font-semibold">{tManagerUi('unable_to_load_the_seat_matrix')}</p>
        <p className="text-secondary mt-2">{tManagerUi('check_your_connection_and_try_again')}</p>
        <button
          type="button"
          className="mgr-btn-primary mt-4"
          onClick={() => { void refetch(); }}
          disabled={isFetching}
        >
          {isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}
        </button>
      </section>
    );
  }

  return (
    <div className="ss-page">
      {/* ── Top Unified Toolbar ── */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Shift filter tabs */}
          <div className="ss-tab-group flex bg-floating p-1 rounded-lg border border-border">
            {SHIFT_TABS.map(({ value, labelKey }) => (
              <button
                type="button"
                key={value}
                onClick={() => { setActiveTab(value); setPage(0); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md motion-safe:transition-colors ${
                  activeTab === value ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                {tManagerUi(labelKey)}
              </button>
            ))}
          </div>

          {/* Gender filter tabs */}
          <div className="flex items-center gap-1.5 bg-floating p-1 rounded-lg border border-border">
            <select
              aria-label="Filter seats by gender"
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value as 'all' | 'Male' | 'Female'); setPage(0); }}
              className="bg-card text-primary text-xs font-semibold px-2.5 py-1.5 rounded-md border-0 focus:ring-1 focus:ring-primary shadow-xs"
            >
              <option value="all">👥 All Genders</option>
              <option value="Male">👨 Male Students</option>
              <option value="Female">👩 Female Students</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-floating p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'
              }`}
            >
              <LayoutGrid size={15} /> ⊞ Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'
              }`}
            >
              <List size={15} /> ☰ Table View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>

          {/* Add Seat CTA */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} /> Add Seat
          </button>

          <div
            className="ss-date-btn flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-lg text-secondary"
            aria-describedby="manager-seat-matrix-date-filter-help"
            title={tManagerUi('date_filtering_is_unavailable_because_the_supplied_seat_8f003e')}
          >
            <CalendarDays size={15} aria-hidden="true" />
            <span className="text-sm">{tManagerUi('date_filter_unavailable')}</span>
          </div>
        </div>
      </div>

      <p id="manager-seat-matrix-date-filter-help" className="text-secondary text-xs mb-4" role="status">
        {tManagerUi('date_based_filtering_is_disabled_until_an_authoritative_a5c22e')}
      </p>

      {/* ── Dynamic Content: GRID VIEW OR TABLE VIEW ── */}
      {viewMode === 'grid' ? (
        <ManagerSeatsMatrixGridView
          visibleGridSeats={visibleGridSeats}
          isPending={isPending}
          freeCount={freeCount}
          onSelectSeat={setSelectedSeat}
          shiftLabel={shiftLabel}
        />
      ) : (
        <ManagerSeatsMatrixTableView
          filteredTableSeats={filteredTableSeats}
          paginatedTableSeats={paginatedTableSeats}
          searchQuery={searchQuery}
          setSearchQuery={(val) => {
            setSearchQuery(val);
            setPage(0);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setPage(0);
          }}
          genderFilter={genderFilter}
          setGenderFilter={(val) => {
            setGenderFilter(val);
            setPage(0);
          }}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onSelectSeat={setSelectedSeat}
          shiftLabel={shiftLabel}
          page={page}
          pageSize={pageSize}
          totalTablePages={totalTablePages}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />
      )}

      {/* Add Seat Modal */}
      <ManagerSeatsMatrixAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSeat={addSeat}
      />

      <ManagerSeatsMatrixModal
        selectedSeat={selectedSeat}
        onClose={() => setSelectedSeat(null)}
        onUpdateSeat={updateSeat}
      />
    </div>
  );
}
