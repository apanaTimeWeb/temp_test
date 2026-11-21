// components/SuperadminDataBackupOperationsMain.tsx
// RESPONSIBILITY: Root client orchestrator for Superadmin Backup Operations. Owns layout and modals; no direct fetch calls.
'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarClock, Plus, AlertCircle, RefreshCw, History } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { useSuperadminDataBackupOperations } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/hooks/useSuperadminDataBackupOperations';
import { SuperadminDataBackupOperationsFullSnapshotCard } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsFullSnapshotCard';
import { SuperadminDataBackupOperationsSchedulesTable } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsSchedulesTable';
import { SuperadminDataBackupOperationsScheduleModal } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsScheduleModal';
import { SuperadminDataBackupOperationsFullBackupModal } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsFullBackupModal';
import { SuperadminDataBackupOperationsSkeleton } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsSkeleton';
import { SuperadminDataBackupOperationsEmptyState } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsEmptyState';

export function SuperadminDataBackupOperationsMain() {
  const {
    schedules,
    isLoading,
    isError,
    errorMessage,
    refetch,
    searchFilter,
    setSearchFilter,
    isCreateScheduleModalOpen,
    isFullBackupModalOpen,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    openFullBackupModal,
    closeFullBackupModal,
    createSchedule,
    isCreatingSchedule,
    toggleSchedule,
    triggerFullPlatformBackup,
    isSubmittingFullBackup,
  } = useSuperadminDataBackupOperations();

  if (isLoading) {
    return <SuperadminDataBackupOperationsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 space-y-3" data-testid="data_backup-error">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle size={18} />
          Failed to load backup schedules
        </div>
        <p className="text-xs text-rose-300/80">{errorMessage || 'An error occurred contacting the backup scheduler daemon.'}</p>
        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
        >
          <RefreshCw size={12} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="superadmin_data_backup_operations-main">
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <CalendarClock size={24} />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Automated Backup Schedules & Policies
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                RPO Governance
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuous WAL replication, multi-cloud targets, and automated retention windows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={SUPERADMIN_NAVIGATION_ROUTES.data_restore_operations}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            data-testid="data_backup-view-history-btn"
          >
            <History size={14} className="text-emerald-400" />
            <span>Backup History & Snapshots</span>
          </Link>

          <button
            type="button"
            onClick={() => openCreateScheduleModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors shadow-xs cursor-pointer"
            data-testid="data_backup-open-create-btn"
          >
            <Plus size={14} />
            <span>Create Backup Policy</span>
          </button>
        </div>
      </div>

      {/* ── 1. Full Platform Disaster Recovery Banner ── */}
      <SuperadminDataBackupOperationsFullSnapshotCard onTriggerFullBackup={openFullBackupModal} />

      {/* ── 2. Active Schedules Table or Empty State ── */}
      {schedules.length === 0 && !searchFilter ? (
        <SuperadminDataBackupOperationsEmptyState onCreateSchedule={() => openCreateScheduleModal()} />
      ) : (
        <SuperadminDataBackupOperationsSchedulesTable
          schedules={schedules}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          onToggleStatus={toggleSchedule}
        />
      )}

      {/* ── Create Schedule Modal ── */}
      <SuperadminDataBackupOperationsScheduleModal
        isOpen={isCreateScheduleModalOpen}
        onClose={closeCreateScheduleModal}
        onSubmit={createSchedule}
        isSubmitting={isCreatingSchedule}
      />

      {/* ── Full Platform Backup Modal ── */}
      <SuperadminDataBackupOperationsFullBackupModal
        isOpen={isFullBackupModalOpen}
        onClose={closeFullBackupModal}
        onSubmit={triggerFullPlatformBackup}
        isSubmitting={isSubmittingFullBackup}
      />
    </div>
  );
}
