// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsMain.tsx
'use client';

/**
 * @file SuperadminDataRestoreOperationsMain.tsx
 * @description Main orchestrator component for Backup History, Point-in-time Restore,
 * and Regular Sandbox Restore Drills with Multi-Tenant Isolation Enforcement.
 */

import React from 'react';
import { useSuperadminDataRestoreOperations } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/hooks/useSuperadminDataRestoreOperations';
import { SuperadminDataRestoreOperationsSkeleton } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsSkeleton';
import { SuperadminDataRestoreOperationsTenantIsolationBanner } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsTenantIsolationBanner';
import { SuperadminDataRestoreOperationsSandboxDrillCard } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsSandboxDrillCard';
import { SuperadminDataRestoreOperationsSnapshotsTable } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsSnapshotsTable';
import { SuperadminDataRestoreOperationsRestoreModal } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsRestoreModal';
import { SuperadminDataRestoreOperationsEmptyState } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsEmptyState';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function SuperadminDataRestoreOperationsMain() {
  const {
    overview,
    isOverviewPending,
    snapshots,
    isSnapshotsPending,
    snapshotsError,
    drills,
    triggerDrill,
    isTriggeringDrill,
    executeRestore,
    isRestoring,
    selectedSnapshot,
    scopeFilter,
    searchQuery,
    isRestoreModalOpen,
    setScopeFilter,
    setSearchQuery,
    openRestoreModal,
    closeRestoreModal,
    resetFilters,
  } = useSuperadminDataRestoreOperations();

  if (isOverviewPending || isSnapshotsPending) {
    return <SuperadminDataRestoreOperationsSkeleton />;
  }

  if (snapshotsError) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="text-xs font-medium">
            Failed to load backup snapshots history: {snapshotsError.message}
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:text-rose-200 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const lastDrill = drills.length > 0 ? drills[0] : null;

  return (
    <div className="space-y-6">
      {/* 1. Tenant Isolation Assurance Law Banner */}
      <SuperadminDataRestoreOperationsTenantIsolationBanner
        guaranteed={overview?.tenantIsolationGuarantee ?? true}
      />

      {/* 2. Automated Restore Verification & Sandbox Drills */}
      <SuperadminDataRestoreOperationsSandboxDrillCard
        lastDrill={lastDrill}
        onTriggerDrill={() =>
          triggerDrill({
            snapshotId: snapshots[0]?.id ?? 'snp-001',
            notes: 'Weekly automated sandbox disaster recovery verification',
          })
        }
        isTriggering={isTriggeringDrill}
      />

      {/* 3. Backup History Snapshot Catalog */}
      {snapshots.length === 0 ? (
        <SuperadminDataRestoreOperationsEmptyState onResetFilters={resetFilters} />
      ) : (
        <SuperadminDataRestoreOperationsSnapshotsTable
          snapshots={snapshots}
          scopeFilter={scopeFilter}
          onScopeFilterChange={setScopeFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSelectRestore={openRestoreModal}
        />
      )}

      {/* 4. Double Verification Authorized Restore Dialog */}
      <SuperadminDataRestoreOperationsRestoreModal
        isOpen={isRestoreModalOpen}
        snapshot={selectedSnapshot}
        onClose={closeRestoreModal}
        onConfirm={(formData) => executeRestore(formData)}
        isSubmitting={isRestoring}
      />
    </div>
  );
}
