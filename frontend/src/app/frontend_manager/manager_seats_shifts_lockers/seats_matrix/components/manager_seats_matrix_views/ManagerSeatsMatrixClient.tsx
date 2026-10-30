'use client';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { CalendarDays, LayoutGrid, List, Plus, Search, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { useManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/useManagerSeatsMatrixSeatMatrix';
import { SHIFT_TABS, LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { ManagerSeatsMatrixModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModal';
import type { SeatData, SeatStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

// RESPONSIBILITY: Main Client view for Seat Matrix (Unified interactive map & tabular manager). Glues data hook to UI. It does not own backend persistence or cross-feature business logic.

export function ManagerSeatsMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('morning'), Evening: tManagerUi('evening'), 'Full Day': tManagerUi('full_day') };
  const shiftLabel = (value?: string) => value ? (shiftLabels[value] ?? value) : '—';
  const {
    isError, isPending, isFetching, refetch, visible, freeCount,
    activeTab, setActiveTab,
    selectedSeat, setSelectedSeat,
    updateSeat, addSeat,
  } = useManagerSeatsMatrix();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSeatLabel, setNewSeatLabel] = useState('');
  const [newSeatWing, setNewSeatWing] = useState('North Reading Hall (AC)');
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const pageSize = 12;

  // Filtered seats for Table View
  const filteredTableSeats = useMemo(() => {
    return visible.filter((seat) => {
      const matchesSearch = searchQuery.trim() === '' ||
        seat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seat.student && seat.student.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seat.smartId && seat.smartId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || seat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [visible, searchQuery, statusFilter]);

  const totalTablePages = Math.max(1, Math.ceil(filteredTableSeats.length / pageSize));
  const paginatedTableSeats = useMemo(() => {
    return filteredTableSeats.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredTableSeats, page, pageSize]);

  const handleCreateSeat = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newSeatLabel.trim();
    if (!label) return;
    const newSeat: SeatData = {
      uuid: `seat-custom-${Date.now()}`,
      id: label.toUpperCase(),
      status: 'free',
      wing: newSeatWing,
      socketAvailable: true,
    };
    addSeat(newSeat);
    setAddFeedback(`Seat ${newSeat.id} created successfully!`);
    setTimeout(() => {
      setAddFeedback(null);
      setIsAddModalOpen(false);
      setNewSeatLabel('');
    }, 1000);
  };

  if (isError) {
    return (
      <section className="ss-page p-8" role="alert" aria-live="assertive">
        <p className="text-danger font-semibold">{tManagerUi('unable_to_load_the_seat_matrix')}</p>
        <p className="text-secondary mt-2">{tManagerUi('check_your_connection_and_try_again')}</p>
        <button type="button" className="mgr-btn-primary mt-4" onClick={() => { void refetch(); }} disabled={isFetching}>
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
              <button type="button"
                key={value}
                onClick={() => { setActiveTab(value); setPage(0); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md motion-safe:transition-colors ${activeTab === value ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
              >
                {tManagerUi(labelKey)}
              </button>
            ))}
          </div>

          {/* View mode toggle: [ ⊞ Grid View | ☰ Table View ] */}
          <div className="flex items-center gap-1 bg-floating p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
            >
              <LayoutGrid size={15} /> ⊞ Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
            >
              <List size={15} /> ☰ Table View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

      {/* ── Legend ── */}
      <div className="ss-legend-card flex flex-wrap gap-6 mb-6 p-4 bg-card border border-border rounded-lg">
        {LEGEND_ITEMS.map(({ cls, labelKey }) => (
          <div key={labelKey} className="ss-legend-item flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${cls === 'ss-legend-dot--success' ? 'bg-success' : cls === 'ss-legend-dot--danger' ? 'bg-danger' : cls === 'ss-legend-dot--warning' ? 'bg-warning' : 'bg-surface-highlight'}`} />
            <span className="text-sm text-secondary">{tManagerUi(labelKey)}</span>
          </div>
        ))}
      </div>

      {/* ── Dynamic Content: GRID VIEW OR TABLE VIEW ── */}
      {viewMode === 'grid' ? (
        <div className="ss-card ss-card--p-lg ss-locker-grid-card bg-card border border-border rounded-xl p-6">
          <div className="ss-matrix-grid-header flex justify-between items-end mb-6 border-b border-border pb-4">
            <h2 className="text-xl font-bold text-primary">{tManagerUi('a_wing_floor_plan')}</h2>
            <span className="text-sm text-success font-medium">{isPending ? '…' : freeCount} {tManagerUi('seats_free_41c53c')}</span>
          </div>

          {isPending ? (
            <div className="flex items-center justify-center py-24 text-secondary">{tManagerUi('loading_seat_matrix')}</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {visible.map((seat) => (
                <button type="button"
                  key={seat.uuid || seat.id}
                  className={`h-12 rounded-lg text-sm font-semibold flex items-center justify-center motion-safe:transition-transform hover:scale-105 active:scale-95 ${seat.status === 'free' ? 'bg-floating border border-success text-success hover:bg-success hover:text-primary' :
                    seat.status === 'occupied' ? 'bg-danger text-on-danger border-transparent opacity-90' :
                      seat.status === 'expiring' ? 'bg-warning text-on-warning border-transparent' :
                        'bg-floating text-secondary border-transparent opacity-50 cursor-not-allowed'
                    }`}
                  disabled={seat.status === 'unknown'}
                  onClick={() => setSelectedSeat(seat)}
                  title={
                    seat.student
                      ? `${seat.student} · ${shiftLabel(seat.shift)} · ${tManagerUi('expires')} ${seat.expiry}`
                      : seat.status === 'maintenance' ? tManagerUi('under_maintenance') : seat.status === 'unknown' ? tManagerUi('unknown_status') : tManagerUi('available')
                  }
                >
                  {seat.id}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold text-primary">Seat Directory & Roster Table</h2>
              <p className="text-xs text-secondary mt-0.5">Unified tabular seat registry with instant allocation & maintenance controls</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="search"
                  placeholder="Filter seats or students..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  className="mgr-input pl-9 w-full text-xs"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="mgr-select text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="free">Available (Free)</option>
                <option value="occupied">Occupied</option>
                <option value="expiring">Expiring Soon</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="mgr-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-floating text-secondary text-xs uppercase font-semibold">
                  <th className="py-3 px-4 w-2/12">Seat ID</th>
                  <th className="py-3 px-4 w-2/12">Wing / Zone</th>
                  <th className="py-3 px-4 w-2/12">Shift</th>
                  <th className="py-3 px-4 w-2/12">Status</th>
                  <th className="py-3 px-4 w-3/12">Assigned Student</th>
                  <th className="py-3 px-4 w-1/12 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTableSeats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-secondary">
                      No seats matching current criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTableSeats.map((seat) => (
                    <tr key={seat.uuid || seat.id} className="border-b border-border/50 hover:bg-floating/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">{seat.id}</td>
                      <td className="py-3 px-4 text-secondary text-xs">{seat.wing || 'North Reading Hall (AC)'}</td>
                      <td className="py-3 px-4 text-xs">{shiftLabel(seat.shift)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${seat.status === 'free' ? 'bg-success-bg text-success border border-success/30' :
                          seat.status === 'occupied' ? 'bg-danger-bg text-danger border border-danger/30' :
                            seat.status === 'expiring' ? 'bg-warning-bg text-warning border border-warning/30' :
                              seat.status === 'maintenance' ? 'bg-warning-bg text-warning border border-warning/30' :
                                'bg-floating text-secondary'
                          }`}>
                          {seat.status === 'free' ? tManagerUi('available') :
                            seat.status === 'occupied' ? tManagerUi('occupied') :
                              seat.status === 'expiring' ? tManagerUi('expiring_soon') :
                                seat.status === 'maintenance' ? tManagerUi('maintenance') : 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {seat.student ? (
                          <div>
                            <span className="font-semibold text-primary block leading-tight">{seat.student}</span>
                            <span className="text-xs text-secondary font-mono">{seat.smartId || '—'}</span>
                          </div>
                        ) : (
                          <span className="text-secondary text-xs italic">— Unassigned —</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSeat(seat)}
                          className="mgr-btn-ghost text-xs px-2.5 py-1 text-primary hover:text-info"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-secondary">
            <span>
              Showing {filteredTableSeats.length === 0 ? 0 : page * pageSize + 1} to {Math.min((page + 1) * pageSize, filteredTableSeats.length)} of {filteredTableSeats.length} seats
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                className="mgr-btn-ghost text-xs px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalTablePages - 1}
                onClick={() => setPage((prev) => Math.min(totalTablePages - 1, prev + 1))}
                className="mgr-btn-ghost text-xs px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Seat Modal */}
      {isAddModalOpen && (
        <div className="ss-modal-overlay flex items-center justify-center fixed inset-0 z-50 bg-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary mb-4">Add New Library Desk / Seat</h3>
            {addFeedback && (
              <div className="mb-4 p-3 bg-success-bg border border-success text-success text-sm rounded-lg flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{addFeedback}</span>
              </div>
            )}
            <form onSubmit={handleCreateSeat} className="space-y-4">
              <div>
                <label htmlFor="new-seat-id" className="text-xs font-semibold text-secondary uppercase block mb-1">Seat Number / Code</label>
                <input
                  id="new-seat-id"
                  type="text"
                  required
                  placeholder="e.g. A-21, B-05"
                  value={newSeatLabel}
                  onChange={(e) => setNewSeatLabel(e.target.value)}
                  className="mgr-input w-full"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="new-seat-wing" className="text-xs font-semibold text-secondary uppercase block mb-1">Wing / Section</label>
                <select
                  id="new-seat-wing"
                  value={newSeatWing}
                  onChange={(e) => setNewSeatWing(e.target.value)}
                  className="mgr-select w-full"
                >
                  <option value="North Reading Hall (AC)">North Reading Hall (AC)</option>
                  <option value="South Reading Hall (AC)">South Reading Hall (AC)</option>
                  <option value="Silent Study Zone">Silent Study Zone</option>
                  <option value="First Floor Main Wing">First Floor Main Wing</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="mgr-btn-ghost flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="mgr-btn-primary flex-1">Create Seat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ManagerSeatsMatrixModal selectedSeat={selectedSeat} onClose={() => setSelectedSeat(null)} onUpdateSeat={updateSeat} />
    </div>
  );
}
