'use client';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Search, LayoutGrid, List, Plus, Download, Armchair } from 'lucide-react';
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
    const blob = new Blob([[headers.join(','), ...rows.map((r) => r.join(','))].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: `seat_matrix_${new Date().toISOString().slice(0, 10)}.csv` });
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
    <div className="ss-page space-y-5">
      {/* ── Top Unified Control Center (Clean 2-Tier Toolbar) ── */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
        {/* Tier 1: Title, Hall Indicator, View Mode & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <Armchair size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-primary">Reading Hall Seat Matrix</h1>
              <p className="text-xs text-secondary">Interactive Multi-Shift Vacancy & Student Allocation Grid</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                <LayoutGrid size={13} /> ⊞ Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'table' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                <List size={13} /> ☰ Table
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mgr-btn-primary mgr-btn-sm inline-flex items-center gap-1.5 text-xs font-bold"
            >
              <Plus size={14} /> Add Seat
            </button>
          </div>
        </div>

        {/* Tier 2: Search Box + Shift Tabs + Gender Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Universal Student / Seat Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="search"
              placeholder="Search student, seat #, or Smart ID (e.g. Rahul, S-12)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="mgr-input pl-8 py-1.5 text-xs w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Shift Filter Pills */}
            <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
              {SHIFT_TABS.map(({ value, labelKey }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => { setActiveTab(value); setPage(0); }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === value ? 'bg-card text-primary font-bold shadow-sm' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {tManagerUi(labelKey)}
                </button>
              ))}
            </div>

            {/* Gender Selector */}
            <select
              aria-label="Filter seats by gender"
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value as 'all' | 'Male' | 'Female'); setPage(0); }}
              className="bg-surface text-primary text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-border focus:ring-1 focus:ring-primary shadow-xs"
            >
              <option value="all">👥 All Genders</option>
              <option value="Male">👨 Male Students</option>
              <option value="Female">👩 Female Students</option>
            </select>
          </div>
        </div>
      </div>

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
          shiftLabel={shiftLabel}
          page={page}
          pageSize={pageSize}
          totalTablePages={totalTablePages}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
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
