'use client';
// RESPONSIBILITY: AdminShiftsManagementPage component owned by admin_shifts; responsibility folder: admin_shifts_components_views.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Plus, Printer, Upload, Search, Building2, IndianRupee, Clock, CheckCircle2, Users, TrendingUp, Moon } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ADMIN_SHIFTS_DEMO_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/mocks/scenarios/admin_shifts_management.scenarios';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { serializeAdminShiftsCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/utils/AdminShiftsManagementCsvUtils';
import { AdminShiftsManagementAddModal } from './AdminShiftsManagementAddModal';

function getShiftDurationHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  let diff = (eH * 60 + eM) - (sH * 60 + sM);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

function isShiftOvernight(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  return (eH * 60 + eM) <= (sH * 60 + sM);
}

function getBranchBadgeClass(branchName?: string): string {
  if (!branchName) return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
  const lower = branchName.toLowerCase();
  if (lower.includes('downtown')) return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400';
  if (lower.includes('westside')) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  if (lower.includes('north')) return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
  return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
}

/** Admin Shift overview and shift configuration. */
export function AdminShiftsManagementPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [shifts, setShifts] = useState<AdminShiftsShift[]>(() => isDemoMode ? [...ADMIN_SHIFTS_DEMO_SHIFTS] : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const visibleShifts = useMemo(() => {
    return shifts.filter((shift) => {
      // Global header branch filter
      if (!isAllBranches && selectedBranch) {
        if (shift.branchName && shift.branchName !== 'All Branches') {
          const sName = selectedBranch.name.toLowerCase();
          const bName = shift.branchName.toLowerCase();
          if (!sName.includes(bName) && !bName.includes(sName)) return false;
        }
      }

      if (statusFilter === 'active' && !shift.active) return false;
      if (statusFilter === 'inactive' && shift.active) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = shift.name.toLowerCase().includes(q);
        const matchesTimes = `${shift.startTime} ${shift.endTime}`.toLowerCase().includes(q);
        const matchesBranch = shift.branchName?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesTimes && !matchesBranch) return false;
      }
      return true;
    });
}, [shifts, isAllBranches, selectedBranch, statusFilter, searchQuery]);

const shiftStats = useMemo(() => {
  const total = visibleShifts.length;
  const active = visibleShifts.filter((s) => s.active).length;
  const totalCapacity = visibleShifts.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalOccupancy = visibleShifts.reduce((acc, s) => acc + (s.occupancy || 0), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
  return { total, active, totalCapacity, totalOccupancy, avgOccupancy };
}, [visibleShifts]);

const exportCsv = () => {
  if (!isDemoMode) return;
  const blob = new Blob([serializeAdminShiftsCsv(shifts)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-shifts-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

return (
  <div className="min-w-0 space-y-6">
    {!isDemoMode && (
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">
        {t('liveShiftNotice')}
      </p>
    )}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('shiftsTitle')}</h1>
        <p className="text-sm text-text-secondary">{t('shiftsSubtitle')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 admin-shared-action-row" >
        <button
          type="button"
          data-testid="admin_shifts-page-control-add-shift"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} strokeWidth={2} /> Add Shift
        </button>
        <button
          type="button"
          data-testid="admin_shifts-page-control-001"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start"
          disabled
          title={t('demoShiftImportUnavailable')}
        >
          <Upload size={18} strokeWidth={2} />{t('import')}
        </button>
        <button
          type="button"
          data-testid="admin_shifts-page-control-002"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start cursor-pointer"
          disabled={!isDemoMode}
          title={!isDemoMode ? t('liveShiftNotice') : undefined}
          onClick={exportCsv}
        >
          <Download size={18} strokeWidth={2} />{t('csv')}
        </button>
        <button
          type="button"
          data-testid="admin_shifts-page-control-003"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start cursor-pointer"
          disabled={!isDemoMode}
          title={!isDemoMode ? t('liveShiftNotice') : undefined}
          onClick={() => window.print()}
        >
          <Printer size={18} strokeWidth={2} />{t('print')}
        </button>
      </div>
    </div>

    {/* 4 Premium Glassmorphic KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Total Shifts</span>
          <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Clock size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{shiftStats.total}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">{selectedBranch ? selectedBranch.name : 'Configured shifts'}</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Active Shifts</span>
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <CheckCircle2 size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">{shiftStats.active}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Currently accepting bookings</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Total Capacity</span>
          <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Users size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{shiftStats.totalCapacity}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Max concurrent desk slots</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-purple-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Enrolled Seats</span>
          <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <TrendingUp size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-purple-400 tabular-nums">{shiftStats.totalOccupancy}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">{shiftStats.avgOccupancy}% network utilization</p>
      </div>
    </div>

    {/* Search and Filters Bar with In-Page Branch Selector */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search shifts by name, timing, or branch..."
          className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1">
          {(['all', 'active', 'inactive'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${statusFilter === filter
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-surface-highlight text-muted-foreground hover:text-foreground'
                }`}
            >
              {filter === 'all' ? 'All Shifts' : filter === 'active' ? 'Active' : 'Inactive'}
            </button>
          ))}
        </div>
      </div>
    </div>

    {visibleShifts.length === 0 ? (
      <div data-testid="admin_shifts-page-state-004" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
        <p data-testid="admin_shifts-page-state-005" className="mb-1 text-3xl">🕐</p>
        <p data-testid="admin_shifts-page-state-006" className="text-sm font-semibold text-text-primary">{t('noShiftsDefined')}</p>
        <p data-testid="admin_shifts-page-state-007" className="text-sm text-text-secondary">{t('noShiftsConfigured')}</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleShifts.map((shift) => {
          const duration = getShiftDurationHours(shift.startTime, shift.endTime);
          const overnight = isShiftOvernight(shift.startTime, shift.endTime);
          const branchBadgeClass = getBranchBadgeClass(shift.branchName);

          return (
            <div key={shift.id} className={`min-w-0 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40${!shift.active ? ' opacity-75' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-text-primary">{shift.name}</h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      {shift.branchName && (
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${branchBadgeClass}`}>
                          <Building2 size={11} className="shrink-0" />
                          <span>{shift.branchName}</span>
                        </span>
                      )}
                      {overnight && (
                        <span className="inline-flex items-center gap-0.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300">
                          <Moon size={10} /> Overnight
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    data-testid="admin_shifts-page-state-008"
                    className={`inline-flex min-h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${shift.active ? 'border-success-text bg-success-bg text-success-text' : 'border-border bg-surface-highlight text-text-secondary'}`}
                  >
                    {shift.active ? t('activeStatus') : t('inactiveStatus')}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-highlight p-3">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary flex items-center gap-1.5">
                      <Clock size={13} className="text-primary" />
                      <span>{shift.startTime} → {shift.endTime}</span>
                    </p>
                    <p className="text-[11px] text-text-secondary font-mono mt-0.5">
                      {duration} Hours Duration
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-bold text-primary shadow-xs">
                    <IndianRupee size={12} />
                    <span>{shift.monthlyPrice ?? 700} / mo</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>
                    <p className="text-xs text-text-secondary">{t('occupancy')}</p>
                    <p className="text-sm font-semibold tabular-nums text-text-primary">
                      {t('studentsCount', { count: shift.occupancy })}
                      <span className="font-mono text-xs text-text-secondary"> / {shift.capacity} Desks</span>
                    </p>
                  </div>
                  <div className="w-24 h-2 overflow-hidden rounded-full bg-surface-highlight">
                    <div
                      className={`h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-base admin-dynamic-width-${Math.min(100, Math.max(0, Math.round((shift.occupancy / Math.max(1, shift.capacity)) * 100)))}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    <AdminShiftsManagementAddModal
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      onAddShift={(newShift) => setShifts((prev) => [...prev, newShift])}
      selectedBranchName={selectedBranch?.name}
    />
  </div>
);
}

export default AdminShiftsManagementPage;
