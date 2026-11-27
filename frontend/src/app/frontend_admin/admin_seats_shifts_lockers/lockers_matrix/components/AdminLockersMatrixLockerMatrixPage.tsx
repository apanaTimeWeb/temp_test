'use client';
// RESPONSIBILITY: AdminLockersLockerMatrixPage component owned by admin_lockers; responsibility folder: admin_lockers_components_views.

import { ADMIN_LOCKERS_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/api/admin_lockers_matrix.query_keys';
import { AdminLockersMatrixDetailModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixDetailModal';
import { AdminLockersMatrixDisplayViews } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixDisplayViews';
import AdminLockersLockerMatrixStats from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixLockerMatrixStats';
import { AdminLockersMatrixSettingsModal, type LockerPricingPolicy } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixSettingsModal';
import { useAdminLockersLockerMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/hooks/useAdminLockersMatrixLockerMatrix';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { exportLockersMatrixCsv, exportLockersMatrixExcel, printLockersMatrixRoster } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/utils/adminLockersMatrixExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQueryClient } from '@tanstack/react-query';
import { Download, FileSpreadsheet, KeyRound, LayoutGrid, List, Printer, Search, Settings, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const LEGEND_ITEMS: Array<{ label: string; dot: string }> = [
  { dot: 'bg-success-text', label: 'statusFree' },
  { dot: 'bg-danger-text', label: 'statusOccupied' },
  { dot: 'bg-warning-text', label: 'statusMaintenance' },
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pricingPolicy, setPricingPolicy] = useState<LockerPricingPolicy>({
    monthlyRent: 200,
    securityDeposit: 500,
    lostKeyFee: 150,
    lateFeePerDay: 20,
    branchName: 'All Branches',
  });

  const lockerMatrixQuery = useAdminLockersLockerMatrix();
  const lockers = lockerMatrixQuery.data ?? [];
  const isPending = lockerMatrixQuery.isPending;
  const errorMessage = lockerMatrixQuery.isError && lockerMatrixQuery.data === undefined ? t('lockerMatrixLoadError') : null;

  useEffect(() => {
    setActiveBranchFilter(!isAllBranches && selectedBranch ? selectedBranch.name : 'All Branches');
  }, [isAllBranches, selectedBranch]);

  const visibleLockers = useMemo(() => {
    return lockers.filter((locker) => {
      if (activeBranchFilter !== 'All Branches') {
        const lBranch = (locker.branchName || '').toLowerCase();
        const bTarget = activeBranchFilter.toLowerCase();
        if (!lBranch.includes(bTarget) && !bTarget.includes(lBranch)) return false;
      } else if (!isAllBranches && selectedBranch && locker.branchId && locker.branchId !== selectedBranchId) {
        return false;
      }
      if (statusFilter !== 'all' && locker.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatches = locker.id.toLowerCase().includes(q) || `l-${locker.id}`.toLowerCase().includes(q);
        const studentMatches = locker.student?.toLowerCase().includes(q) ?? false;
        const phoneMatches = locker.phone?.includes(q) ?? false;
        const smartIdMatches = locker.smartId?.toLowerCase().includes(q) ?? false;
        if (!idMatches && !studentMatches && !phoneMatches && !smartIdMatches) return false;
      }
      return true;
    });
  }, [lockers, activeBranchFilter, isAllBranches, selectedBranch, selectedBranchId, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: visibleLockers.length,
    free: visibleLockers.filter((l) => l.status === 'free').length,
    occupied: visibleLockers.filter((l) => l.status === 'occupied').length,
    maintenance: visibleLockers.filter((l) => l.status === 'maintenance').length,
    unknown: visibleLockers.filter((l) => l.status === 'unknown').length,
  }), [visibleLockers]);

  const handleAllocate = (allocData: { student: string; smartId?: string; phone?: string; shift?: string; expiry?: string; fee?: number }) => {
    if (!selectedLocker) return;
    const targetId = selectedLocker.id;
    queryClient.setQueryData<AdminLockersLockerMatrixViewModel[]>(queryKey, (prev) =>
      prev?.map((l) =>
        l.id === targetId
          ? {
              ...l,
              status: 'occupied',
              student: allocData.student,
              smartId: allocData.smartId || `SL-${targetId}`,
              phone: allocData.phone,
              shift: allocData.shift || 'Full Day Dedicated',
              expiry: allocData.expiry || '2026-06-30',
              allottedByManager: 'Admin Operations',
              allottedDate: new Date().toISOString().slice(0, 10),
            }
          : l,
      ),
    );
    toast.success(`Locker #${targetId} successfully allocated to ${allocData.student}. Key tag issued.`, { id: 'admin-lockers-allocate' });
    setSelectedLocker(null);
  };

  const handleVacate = () => {
    if (!selectedLocker) return;
    const targetId = selectedLocker.id;
    queryClient.setQueryData<AdminLockersLockerMatrixViewModel[]>(queryKey, (prev) =>
      prev?.map((l) =>
        l.id === targetId
          ? { ...l, status: 'free', student: undefined, smartId: undefined, phone: undefined, shift: undefined, expiry: undefined, allottedByManager: undefined, allottedDate: undefined }
          : l,
      ),
    );
    toast.success(`Locker #${targetId} vacated and returned to free pool.`, { id: 'admin-lockers-vacate' });
    setSelectedLocker(null);
  };

  const handleSetMaintenance = (isMaintenance: boolean) => {
    if (!selectedLocker) return;
    const targetId = selectedLocker.id;
    queryClient.setQueryData<AdminLockersLockerMatrixViewModel[]>(queryKey, (prev) =>
      prev?.map((l) => (l.id === targetId ? { ...l, status: isMaintenance ? 'maintenance' : 'free', student: isMaintenance ? undefined : l.student } : l)),
    );
    toast.success(
      isMaintenance
        ? `Locker #${targetId} marked under maintenance.`
        : `Locker #${targetId} repaired and marked available for student allocation.`,
      { id: 'admin-lockers-maintenance' },
    );
    setSelectedLocker(null);
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            Locker Asset Custody &amp; Allocation
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2 mt-1">
            <KeyRound size={22} className="text-primary" aria-hidden="true" />
            {selectedBranch ? `${selectedBranch.name} Locker Matrix` : t('lockerMatrixTitle')}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">Real-time visual locker inventory, student key allotment, and branch maintenance audit</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 bg-card p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <LayoutGrid size={14} aria-hidden="true" /> Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <List size={14} aria-hidden="true" /> Table View
            </button>
          </div>

          <button type="button" onClick={() => setIsSettingsOpen(true)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3.5 py-1.5 text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity shadow-card cursor-pointer" title="Configure Monthly Rent & Refundable Security Deposit">
            <Settings size={14} aria-hidden="true" />
            <span>Settings (₹{pricingPolicy.monthlyRent}/mo)</span>
          </button>
          <button type="button" onClick={() => exportLockersMatrixCsv(visibleLockers, activeBranchFilter)} disabled={visibleLockers.length === 0} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3.5 py-1.5 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card cursor-pointer disabled:opacity-40" title="Export Locker Allotment List to CSV">
            <Download size={14} aria-hidden="true" />
            <span>Export CSV</span>
          </button>
          <button type="button" onClick={() => exportLockersMatrixExcel(visibleLockers, activeBranchFilter)} disabled={visibleLockers.length === 0} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3.5 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card cursor-pointer disabled:opacity-40" title="Export Locker Allotment List to Excel (.xls)">
            <FileSpreadsheet size={14} aria-hidden="true" />
            <span>Excel</span>
          </button>
          <button type="button" onClick={() => printLockersMatrixRoster(visibleLockers, activeBranchFilter, stats, pricingPolicy)} disabled={visibleLockers.length === 0} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card cursor-pointer disabled:opacity-40" title="Print Locker Custody & Allotment Roster">
            <Printer size={14} aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <AdminLockersLockerMatrixStats {...stats} />

      <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" aria-hidden="true" />
            <input
              maxLength={100}
              type="text"
              placeholder="Search by locker number (#05), student name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-input pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'free', 'occupied', 'maintenance'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold motion-safe:transition-colors cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-primary text-on-primary shadow-card'
                    : 'border border-border bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {filter === 'all' ? 'All Lockers' : filter === 'free' ? 'Available Free' : filter === 'occupied' ? 'Occupied' : 'Maintenance'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface-highlight p-3 text-xs text-text-secondary">
        <span className="font-semibold uppercase tracking-wider text-text-secondary text-[11px]">Legend:</span>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} aria-hidden="true" />
            <span className="text-text-primary font-medium">{t(item.label)}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
        {isPending ? (
          <div className="py-16 text-center text-text-secondary" role="status">{t('loadingLockerMatrix')}</div>
        ) : errorMessage ? (
          <div className="py-16 text-center">
            <p className="mb-3 text-danger-text font-semibold">{errorMessage}</p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors cursor-pointer"
              onClick={() => { void lockerMatrixQuery.refetch(); }}
            >
              {t('retry')}
            </button>
          </div>
        ) : visibleLockers.length === 0 ? (
          <div className="py-16 text-center text-text-secondary">{t('noLockersFound')}</div>
        ) : (
          <AdminLockersMatrixDisplayViews
            viewMode={viewMode}
            visibleLockers={visibleLockers}
            selectedBranchName={selectedBranch?.name}
            onSelectLocker={setSelectedLocker}
          />
        )}
      </div>

      <AdminLockersMatrixDetailModal
        locker={selectedLocker}
        branchName={selectedBranch?.name}
        onClose={() => setSelectedLocker(null)}
        onAllocate={handleAllocate}
        onVacate={handleVacate}
        onSetMaintenance={handleSetMaintenance}
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <ShieldAlert size={16} className="text-primary" aria-hidden="true" />
          <span>HQ Asset Governance &amp; Desk Operations Boundary</span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Lockers are physical branch assets governed by branch-level custody. Physical key handovers, locker allotment at admission, and key deposits are managed on-site by Branch Managers. Central Admin oversees network-wide inventory, branch utilization ratios, and scheduled maintenance audits.
        </p>
      </div>

      <AdminLockersMatrixSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentPolicy={pricingPolicy}
        onSavePolicy={(updated) => setPricingPolicy(updated)}
      />
    </div>
  );
}

export default AdminLockersLockerMatrixPage;
