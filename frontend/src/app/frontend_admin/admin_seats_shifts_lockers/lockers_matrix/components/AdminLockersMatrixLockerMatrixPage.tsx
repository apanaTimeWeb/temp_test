'use client';
// RESPONSIBILITY: AdminLockersLockerMatrixPage component owned by admin_lockers; responsibility folder: admin_lockers_components_views.

import { useTranslations } from 'next-intl';
import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound, Building2, ShieldAlert, LayoutGrid, List, Search, Filter, Lock, Unlock, Wrench, Sparkles, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminLockersLockerMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/hooks/useAdminLockersMatrixLockerMatrix';
import { ADMIN_LOCKERS_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/api/admin_lockers_matrix.query_keys';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import AdminLockersLockerMatrixStats from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixLockerMatrixStats';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  AdminLockersMatrixDetailModal,
  ADMIN_LOCKER_MATRIX_STATUS_CLASS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixDetailModal';

const LEGEND_ITEMS: Array<{ label: string; cls: string; dot: string }> = [
  { cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400', label: 'statusFree' },
  { cls: 'border-rose-500/40 bg-rose-500/10 text-rose-400', dot: 'bg-rose-400', label: 'statusOccupied' },
  { cls: 'border-amber-500/40 bg-amber-500/10 text-amber-400', dot: 'bg-amber-400', label: 'statusMaintenance' },
];

export function AdminLockersLockerMatrixPage() {
  const t = useTranslations('ADMIN_LOCKERS');
  const isDemo = isFrontendDemoModeEnabled();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ADMIN_LOCKERS_MATRIX_QUERY_KEYS.list({ resource: 'locker-matrix', demo: isDemo }), [isDemo]);

  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();
  const [activeBranchFilter, setActiveBranchFilter] = useState('All Branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'occupied' | 'maintenance'>('all');
  const [selectedLocker, setSelectedLocker] = useState<AdminLockersLockerMatrixViewModel | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const lockerMatrixQuery = useAdminLockersLockerMatrix();
  const lockers = lockerMatrixQuery.data ?? [];
  const isPending = lockerMatrixQuery.isPending;
  const errorMessage = lockerMatrixQuery.isError && lockerMatrixQuery.data === undefined
    ? t('lockerMatrixLoadError')
    : null;

  // Sync in-page branch filter when header branch changes
  useEffect(() => {
    if (!isAllBranches && selectedBranch) {
      setActiveBranchFilter(selectedBranch.name);
    } else {
      setActiveBranchFilter('All Branches');
    }
  }, [isAllBranches, selectedBranch]);

  // Filter lockers by active branch selection, status, and search query
  const visibleLockers = useMemo(() => {
    return lockers.filter((locker) => {
      // Branch filter
      if (activeBranchFilter !== 'All Branches') {
        const lBranch = (locker.branchName || '').toLowerCase();
        const bTarget = activeBranchFilter.toLowerCase();
        if (!lBranch.includes(bTarget) && !bTarget.includes(lBranch)) {
          return false;
        }
      } else if (!isAllBranches && selectedBranch) {
        if (locker.branchId && locker.branchId !== selectedBranchId) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && locker.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatches = locker.id.toLowerCase().includes(q) || `l-${locker.id}`.toLowerCase().includes(q);
        const studentMatches = locker.student?.toLowerCase().includes(q) ?? false;
        const phoneMatches = locker.phone?.includes(q) ?? false;
        const smartIdMatches = locker.smartId?.toLowerCase().includes(q) ?? false;
        if (!idMatches && !studentMatches && !phoneMatches && !smartIdMatches) {
          return false;
        }
      }

      return true;
    });
  }, [lockers, activeBranchFilter, isAllBranches, selectedBranch, selectedBranchId, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: visibleLockers.length,
    free: visibleLockers.filter(locker => locker.status === 'free').length,
    occupied: visibleLockers.filter(locker => locker.status === 'occupied').length,
    maintenance: visibleLockers.filter(locker => locker.status === 'maintenance').length,
    unknown: visibleLockers.filter(locker => locker.status === 'unknown').length,
  }), [visibleLockers]);

  // MUTATION: Allocate Locker
  const handleAllocate = (allocData: {
    student: string;
    smartId?: string;
    phone?: string;
    shift?: string;
    expiry?: string;
    fee?: number;
  }) => {
    if (!selectedLocker) return;
    const targetId = selectedLocker.id;

    queryClient.setQueryData<AdminLockersLockerMatrixViewModel[]>(queryKey, (prev) => {
      if (!prev) return prev;
      return prev.map((l) => {
        if (l.id === targetId) {
          return {
            ...l,
            status: 'occupied',
            student: allocData.student,
            smartId: allocData.smartId || `SL-${targetId}`,
            phone: allocData.phone,
            shift: allocData.shift || 'Full Day Dedicated',
            expiry: allocData.expiry || '2026-06-30',
            allottedByManager: 'Admin Operations',
            allottedDate: new Date().toISOString().slice(0, 10),
          };
        }
        return l;
      });
    });

    toast.success(`Locker #${targetId} successfully allocated to ${allocData.student}. Key tag issued.`);
    setSelectedLocker(null);
  };

  // MUTATION: Vacate / Release Locker
  const handleVacate = () => {
    if (!selectedLocker) return;
    const targetId = selectedLocker.id;

    queryClient.setQueryData<AdminLockersLockerMatrixViewModel[]>(queryKey, (prev) => {
      if (!prev) return prev;
      return prev.map((l) => {
        if (l.id === targetId) {
          return {
            ...l,
            status: 'free',
            student: undefined,
            smartId: undefined,
            phone: undefined,
            shift: undefined,
            expiry: undefined,
            allottedByManager: undefined,
            allottedDate: undefined,
          };
        }
        return l;
      });
    });

    toast.success(`Locker #${targetId} vacated and returned to free pool.`);
    setSelectedLocker(null);
  };

  // MUTATION: Toggle Maintenance
  const handleSetMaintenance = (isMaintenance: boolean) => {
    if (!selectedLocker) return;
    const targetId = selectedLocker.id;

    queryClient.setQueryData<AdminLockersLockerMatrixViewModel[]>(queryKey, (prev) => {
      if (!prev) return prev;
      return prev.map((l) => {
        if (l.id === targetId) {
          return {
            ...l,
            status: isMaintenance ? 'maintenance' : 'free',
            student: isMaintenance ? undefined : l.student,
          };
        }
        return l;
      });
    });

    toast.success(
      isMaintenance
        ? `Locker #${targetId} marked under maintenance.`
        : `Locker #${targetId} repaired and marked available for student allocation.`
    );
    setSelectedLocker(null);
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
              <Sparkles size={11} className="text-amber-400" />
              Locker Asset Custody & Allocation
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
            <KeyRound size={22} className="text-indigo-400" />
            {selectedBranch ? `${selectedBranch.name} Locker Matrix` : t('lockerMatrixTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time visual locker inventory, student key allotment, and branch maintenance audit
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid size={14} /> Grid View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <List size={14} /> Table View
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <AdminLockersLockerMatrixStats {...stats} />

      {/* In-Page Branch Selector & Status Toolbar */}
      <div className="flex flex-col gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg backdrop-blur-md">
        {/* Branch Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
            <Building2 size={14} className="text-indigo-400" />
            Branch Filter:
          </span>
          {['All Branches', 'Downtown Central', 'Westside Branch', 'North Hub'].map((branchName) => {
            const isSelected = activeBranchFilter === branchName;
            return (
              <button
                key={branchName}
                type="button"
                onClick={() => setActiveBranchFilter(branchName)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border border-indigo-500/50 bg-indigo-500/20 text-indigo-300 shadow-xs'
                    : 'border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {branchName}
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by locker number (#05), student name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'free', 'occupied', 'maintenance'] as const).map((filter) => {
              const isSelected = statusFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs'
                      : 'border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {filter === 'all'
                    ? 'All Lockers'
                    : filter === 'free'
                    ? 'Available Free'
                    : filter === 'occupied'
                    ? 'Occupied'
                    : 'Maintenance'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs text-slate-300">
        <span className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">Legend:</span>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} aria-hidden="true" />
            <span className="text-slate-300 font-medium">{t(item.label)}</span>
          </div>
        ))}
      </div>

      {/* Locker Matrix Content Area */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        {isPending ? (
          <div className="py-16 text-center text-slate-400" role="status">
            {t('loadingLockerMatrix')}
          </div>
        ) : errorMessage ? (
          <div className="py-16 text-center">
            <p className="mb-3 text-rose-400 font-semibold">{errorMessage}</p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
              onClick={() => { void lockerMatrixQuery.refetch(); }}
            >
              {t('retry')}
            </button>
          </div>
        ) : visibleLockers.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            {t('noLockersFound')}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW: Crisp Rectangular Locker Cards */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {visibleLockers.map((locker) => {
              const isFree = locker.status === 'free';
              const isOccupied = locker.status === 'occupied';
              const isMaintenance = locker.status === 'maintenance';

              const cardClasses = isFree
                ? 'border-emerald-500/35 bg-gradient-to-br from-[#091a16]/90 via-[#0e2721]/80 to-slate-950 text-emerald-300 hover:border-emerald-400 hover:scale-[1.02] shadow-emerald-950/20'
                : isOccupied
                ? 'border-rose-500/35 bg-gradient-to-br from-[#1f0a10]/90 via-[#2d0e17]/80 to-slate-950 text-rose-300 hover:border-rose-400 hover:scale-[1.02] shadow-rose-950/20'
                : 'border-amber-500/35 bg-gradient-to-br from-[#1c1408]/90 via-[#2c200c]/80 to-slate-950 text-amber-300 hover:border-amber-400 hover:scale-[1.02] shadow-amber-950/20';

              return (
                <button
                  key={locker.uuid ?? locker.id}
                  type="button"
                  data-testid={`admin_lockers-locker-${locker.id}`}
                  className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer shadow-md ${cardClasses}`}
                  onClick={() => setSelectedLocker(locker)}
                  title={`Locker #${locker.id} — Click to inspect or manage allocation`}
                  aria-label={`${t('locker')} ${locker.id}, ${t(
                    isFree ? 'statusFree' : isOccupied ? 'statusOccupied' : isMaintenance ? 'statusMaintenance' : 'statusUnknown'
                  )}`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-sm text-white">
                      <KeyRound size={13} className="shrink-0 opacity-80" />
                      <span>#{locker.id}</span>
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isFree ? 'bg-emerald-400' : isOccupied ? 'bg-rose-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <div className="mt-3 min-w-0">
                    {isOccupied ? (
                      <div>
                        <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                          <User size={11} className="text-indigo-400 shrink-0" />
                          <span className="truncate">{locker.student}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                          {locker.smartId ?? 'SL-DT'}
                        </p>
                      </div>
                    ) : isFree ? (
                      <div>
                        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <Unlock size={11} />
                          <span>Vacant</span>
                        </p>
                        <p className="text-[10px] text-emerald-300/70 mt-0.5">Click to allocate</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                          <Wrench size={11} />
                          <span>Maintenance</span>
                        </p>
                        <p className="text-[10px] text-amber-300/70 mt-0.5">Service required</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="truncate">{locker.branchName?.split(' ')[0] ?? 'Branch'}</span>
                    <span className="font-bold text-white/90">
                      {isOccupied ? '🔒 In Use' : isFree ? '🔓 Ready' : '🛠️ Fix'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/40">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 border-b border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Locker No</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Student</th>
                  <th className="p-3">Contact Phone</th>
                  <th className="p-3">Shift</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {visibleLockers.map((locker) => (
                  <tr key={locker.uuid ?? locker.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-white flex items-center gap-1.5">
                      <KeyRound size={13} className="text-indigo-400" /> #{locker.id}
                    </td>
                    <td className="p-3 text-slate-300 font-medium">
                      {locker.branchName ?? selectedBranch?.name ?? 'Downtown Central'}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status] ?? ''}`}>
                        {locker.status === 'free' ? 'Available Free' : locker.status === 'occupied' ? 'Occupied' : locker.status === 'maintenance' ? 'Maintenance' : 'Unknown'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-white">
                      {locker.student ?? <span className="text-slate-500 font-normal italic">— (Vacant)</span>}
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{locker.phone ?? '—'}</td>
                    <td className="p-3 text-slate-400">{locker.shift ?? '—'}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLocker(locker)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Detail & Allocation Dialog */}
      <AdminLockersMatrixDetailModal
        locker={selectedLocker}
        branchName={selectedBranch?.name}
        onClose={() => setSelectedLocker(null)}
        onAllocate={handleAllocate}
        onVacate={handleVacate}
        onSetMaintenance={handleSetMaintenance}
      />

      {/* HQ Governance & Operational Invariants Note */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <ShieldAlert size={16} className="text-indigo-400" />
          <span>HQ Asset Governance & Desk Operations Boundary</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Lockers are physical branch assets governed by branch-level custody. Physical key handovers, locker allotment at admission, and key deposits are managed on-site by Branch Managers. Central Admin oversees network-wide inventory, branch utilization ratios, and scheduled maintenance audits.
        </p>
      </div>
    </div>
  );
}

export default AdminLockersLockerMatrixPage;
