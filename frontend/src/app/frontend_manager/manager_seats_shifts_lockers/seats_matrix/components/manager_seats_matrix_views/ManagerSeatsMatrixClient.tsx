'use client';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutGrid, List, Plus, Download, Armchair, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeManagerSeatMatrixCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixCsv';
import { useManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/useManagerSeatsMatrixSeatMatrix';
import { SHIFT_TABS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import { ManagerSeatsMatrixModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModal';
import { ManagerSeatsMatrixStudentProfileModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixStudentProfileModal';
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

  const router = useRouter();
  const [profileSeat, setProfileSeat] = useState<SeatData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [visible, searchQuery, statusFilter, genderFilter]);

  const filteredTableSeats = filteredSeats;
  const visibleGridSeats = filteredSeats;

  const isFiltered = Boolean(
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    genderFilter !== 'all' ||
    activeTab !== 'All'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenderFilter('all');
    setActiveTab('All');
    setPage(0);
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
    <div className="ss-page !p-0 space-y-4 w-full min-w-0">
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

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                <LayoutGrid size={13} /> ⊞ Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                <List size={13} /> ☰ Table
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <Download size={13} /> Export CSV
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mgr-btn-primary mgr-btn-sm inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Plus size={14} /> Add Seat
            </button>
          </div>
        </div>

        {/* Tier 2: Unified Search & Filter Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Universal Student / Seat Search */}
          <div className="mgr-input-icon-wrap relative flex-1 min-w-0 sm:min-w-[240px]">
            <Search size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            <input
              type="search"
              aria-label={tManagerUi('search_by_seat_branch_or_student')}
              placeholder={tManagerUi('search_by_seat_branch_or_student')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="mgr-input mgr-input-with-icon !pl-10 pr-9 text-xs w-full h-9 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPage(0);
                }}
                aria-label="Clear search"
                title="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-danger hover:opacity-80 rounded-full transition-colors cursor-pointer"
              >
                <X size={14} className="shrink-0 text-danger" />
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Shift Filter Pills */}
            <div className="flex items-center p-1 rounded-xl bg-surface border border-border overflow-x-auto max-w-full h-9 shrink-0">
              {SHIFT_TABS.map(({ value, labelKey }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => { setActiveTab(value); setPage(0); }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === value ? 'bg-card text-primary font-bold shadow-sm' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {tManagerUi(labelKey)}
                </button>
              ))}
            </div>

            {/* Status Filter Dropdown */}
            <select
              aria-label="Filter seats by status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="bg-surface text-primary text-xs font-semibold px-3 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
            >
              <option value="all">⚡ All Statuses</option>
              <option value="free">🟢 Available (Free)</option>
              <option value="occupied">🔴 Occupied</option>
              <option value="expiring">🟡 Expiring Soon</option>
              <option value="maintenance">⚪ Maintenance</option>
            </select>

            {/* Gender Selector Dropdown */}
            <select
              aria-label="Filter seats by gender"
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value as 'all' | 'Male' | 'Female'); setPage(0); }}
              className="bg-surface text-primary text-xs font-semibold px-3 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
            >
              <option value="all">👥 All Genders</option>
              <option value="Male">👨 Male Students</option>
              <option value="Female">👩 Female Students</option>
            </select>

            {/* Reset Filters Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 h-9 rounded-xl border border-danger/30 bg-danger-bg text-danger hover:bg-danger/20 transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
                aria-label="Reset all filters"
              >
                <RotateCcw size={13} className="shrink-0 text-danger" />
                <span>Reset</span>
              </button>
            )}
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
          onViewStudentProfile={setProfileSeat}
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

      {/* Seat Manage Modal */}
      <ManagerSeatsMatrixModal
        selectedSeat={selectedSeat}
        onClose={() => setSelectedSeat(null)}
        onUpdateSeat={updateSeat}
        onOpenStudentProfile={(seat) => {
          setSelectedSeat(null);
          setProfileSeat(seat);
        }}
      />

      {/* Direct Student Profile & KYC Popup */}
      <ManagerSeatsMatrixStudentProfileModal
        isOpen={Boolean(profileSeat)}
        seat={profileSeat}
        onClose={() => setProfileSeat(null)}
        onNavigateToDirectory={(smartId) => {
          setProfileSeat(null);
          router.push(MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId));
        }}
      />
    </div>
  );
}
