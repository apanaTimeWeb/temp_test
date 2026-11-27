'use client';
// RESPONSIBILITY: AdminShiftsManagementPage component owned by admin_shifts; responsibility folder: admin_shifts_components_views.

import { AdminShiftsManagementAddModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementAddModal';
import { AdminShiftsManagementCard } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementCard';
import { AdminShiftsManagementEditModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementEditModal';
import { AdminShiftsManagementImportModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementImportModal';
import { AdminShiftsManagementKpiGrid } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementKpiGrid';
import { ADMIN_SHIFTS_DEMO_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/config/admin_shifts_management.demo_data';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { serializeAdminShiftsCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/utils/AdminShiftsManagementCsvUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Clock, Download, Plus, Printer, Search, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

/** Admin Shift overview and shift configuration. */
export function AdminShiftsManagementPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [shifts, setShifts] = useState<AdminShiftsShift[]>(() => (isDemoMode ? [...ADMIN_SHIFTS_DEMO_SHIFTS] : []));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<AdminShiftsShift | null>(null);

  const handleToggleShiftActive = (shiftId: string) => {
    const target = shifts.find((s) => s.id === shiftId);
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? { ...s, active: !s.active } : s)));
    if (target?.active) {
      toast.info(`Shift "${target.name}" deactivated`, { id: 'admin-shifts-toggle' });
    } else {
      toast.success(`Shift "${target?.name}" activated`, { id: 'admin-shifts-toggle' });
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    const target = shifts.find((s) => s.id === shiftId);
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    toast.success(`Shift "${target?.name || shiftId}" deleted`, { id: 'admin-shifts-delete' });
  };

  const handleSaveShift = (updatedShift: AdminShiftsShift) => {
    setShifts((prev) => prev.map((s) => (s.id === updatedShift.id ? updatedShift : s)));
  };

  const visibleShifts = useMemo(() => {
    return shifts.filter((shift) => {
      if (!isAllBranches && selectedBranch && shift.branchName && shift.branchName !== 'All Branches') {
        const sName = selectedBranch.name.toLowerCase();
        const bName = shift.branchName.toLowerCase();
        if (!sName.includes(bName) && !bName.includes(sName)) return false;
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
        <p role="status" className="mb-4 rounded-md border border-warning bg-warning-bg p-3 text-warning-text">
          {t('liveShiftNotice')}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Clock size={13} aria-hidden="true" />
              Study Timetable &amp; Slots
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">{t('shiftsTitle')}</h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">{t('shiftsSubtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 admin-shared-action-row">
          <button
            type="button"
            data-testid="admin_shifts-page-control-add-shift"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-card cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} strokeWidth={2} aria-hidden="true" /> Add Shift
          </button>
          <button
            type="button"
            data-testid="admin_shifts-page-control-001"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary justify-start cursor-pointer"
            onClick={() => setIsImportModalOpen(true)}
            title="Bulk Import Shifts from CSV"
          >
            <Upload size={18} strokeWidth={2} aria-hidden="true" />{t('import')}
          </button>
          <button
            type="button"
            data-testid="admin_shifts-page-control-002"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start cursor-pointer"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('liveShiftNotice') : undefined}
            onClick={exportCsv}
          >
            <Download size={18} strokeWidth={2} aria-hidden="true" />{t('csv')}
          </button>
          <button
            type="button"
            data-testid="admin_shifts-page-control-003"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 justify-start cursor-pointer"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('liveShiftNotice') : undefined}
            onClick={() => window.print()}
          >
            <Printer size={18} strokeWidth={2} aria-hidden="true" />{t('print')}
          </button>
        </div>
      </div>

      <AdminShiftsManagementKpiGrid
        total={shiftStats.total}
        active={shiftStats.active}
        totalCapacity={shiftStats.totalCapacity}
        totalOccupancy={shiftStats.totalOccupancy}
        avgOccupancy={shiftStats.avgOccupancy}
        selectedBranchName={selectedBranch?.name}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          <input
            maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shifts by name, timing, or branch..."
            className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {(['all', 'active', 'inactive'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider motion-safe:transition-colors cursor-pointer ${
                  statusFilter === filter ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-highlight text-text-secondary hover:text-text-primary'
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
          {visibleShifts.map((shift) => (
            <AdminShiftsManagementCard
              key={shift.id}
              shift={shift}
              onEdit={setEditingShift}
              onToggleActive={handleToggleShiftActive}
              onDelete={handleDeleteShift}
            />
          ))}
        </div>
      )}

      <AdminShiftsManagementAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddShift={(newShift) => setShifts((prev) => [...prev, newShift])}
        selectedBranchName={selectedBranch?.name}
      />
      <AdminShiftsManagementEditModal isOpen={Boolean(editingShift)} onClose={() => setEditingShift(null)} shift={editingShift} onSaveShift={handleSaveShift} />
      <AdminShiftsManagementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportShifts={(newShifts) => setShifts((prev) => [...prev, ...newShifts])}
        defaultBranchName={selectedBranch?.name || 'All Branches'}
      />
    </div>
  );
}

export default AdminShiftsManagementPage;
