'use client';

import { SHIFT_TABS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { Armchair, ArrowLeftRight, Download, LayoutGrid, List, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ManagerSeatsMatrixToolbarProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  genderFilter: 'all' | 'Male' | 'Female';
  onGenderChange: (gender: 'all' | 'Male' | 'Female') => void;
  zoneFilter: string;
  onZoneChange: (zone: string) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onOpenSwapModal: () => void;
  onOpenAddModal: () => void;
}

/** 2-tier view switch, action buttons, and search/shift/status/gender/zone filters for Seat Matrix. */
export function ManagerSeatsMatrixToolbar({
  viewMode,
  setViewMode,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  statusFilter,
  onStatusChange,
  genderFilter,
  onGenderChange,
  zoneFilter,
  onZoneChange,
  isFiltered,
  onResetFilters,
  onExportCsv,
  onOpenSwapModal,
  onOpenAddModal,
}: ManagerSeatsMatrixToolbarProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
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
          <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
              }`}
            >
              <LayoutGrid size={13} /> ⊞ Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
              }`}
            >
              <List size={13} /> ☰ Table
            </button>
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
          >
            <Download size={13} /> Export CSV
          </button>

          <button
            type="button"
            onClick={onOpenSwapModal}
            data-testid="manager-seat-matrix-swap-btn"
            className="inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 motion-safe:transition-colors cursor-pointer"
            title="Directly swap or relocate seats without vacating or losing data"
          >
            <ArrowLeftRight size={13} /> Swap Seats
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="mgr-btn-primary mgr-btn-sm inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Plus size={14} /> Add Seat
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="mgr-input-icon-wrap relative flex-1 min-w-0 sm:min-w-[240px]">
          <Search size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          <input
            maxLength={100}
            type="search"
            aria-label={tManagerUi('search_by_seat_branch_or_student')}
            placeholder={tManagerUi('search_by_seat_branch_or_student')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mgr-input mgr-input-with-icon !pl-10 pr-9 text-xs w-full h-9 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              title="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-danger hover:opacity-80 rounded-full motion-safe:transition-colors cursor-pointer"
            >
              <X size={14} className="shrink-0 text-danger" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-surface border border-border overflow-x-auto max-w-full h-9 shrink-0">
            {SHIFT_TABS.map(({ value, labelKey }) => (
              <button
                type="button"
                key={value}
                onClick={() => onTabChange(value)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg motion-safe:transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === value ? 'bg-card text-primary font-bold shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                {tManagerUi(labelKey)}
              </button>
            ))}
          </div>

          <select
            aria-label="Filter seats by status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-surface text-primary text-xs font-semibold px-3 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
          >
            <option value="all">⚡ All Statuses</option>
            <option value="free">🟢 Available (Free)</option>
            <option value="occupied">🔴 Occupied</option>
            <option value="expiring">🟡 Expiring Soon</option>
            <option value="maintenance">⚪ Maintenance</option>
          </select>

          <select
            aria-label="Filter seats by gender"
            value={genderFilter}
            onChange={(e) => onGenderChange(e.target.value as 'all' | 'Male' | 'Female')}
            className="bg-surface text-primary text-xs font-semibold px-3 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
          >
            <option value="all">👥 All Genders</option>
            <option value="Male">👨 Male Students</option>
            <option value="Female">👩 Female Students</option>
          </select>

          <select
            aria-label="Filter seats by Zone / Hall"
            data-testid="manager-seats-zone-filter"
            value={zoneFilter}
            onChange={(e) => onZoneChange(e.target.value)}
            className="bg-surface text-primary text-xs font-semibold px-3 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
          >
            <option value="all">🏛️ All Zones / Halls</option>
            <option value="AC Hall A">❄️ AC Hall A</option>
            <option value="AC Hall B">❄️ AC Hall B</option>
            <option value="Silent Zone">🤫 Silent Zone</option>
            <option value="Girls Cabin">👩 Girls Cabin</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 h-9 rounded-xl border border-danger bg-danger-bg text-danger hover:opacity-90 motion-safe:transition-opacity cursor-pointer shrink-0"
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
  );
}
