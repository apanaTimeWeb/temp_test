// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/components/SuperadminDataImportMigrationMain.tsx
'use client';

/**
 * @file SuperadminDataImportMigrationMain.tsx
 * @description Main orchestrator for Migration Ingestion (Feature 9), Pre-flight Validation (Feature 10),
 * and Batch History & Instant Rollback (Feature 11).
 */

import React from 'react';
import { useSuperadminDataImportMigration } from '../hooks/useSuperadminDataImportMigration';
import { SuperadminDataImportMigrationSkeleton } from './SuperadminDataImportMigrationSkeleton';
import { SuperadminDataImportMigrationUploadWizard } from './SuperadminDataImportMigrationUploadWizard';
import { SuperadminDataImportMigrationValidationCard } from './SuperadminDataImportMigrationValidationCard';
import { SuperadminDataImportMigrationHistoryTable } from './SuperadminDataImportMigrationHistoryTable';
import { SuperadminDataImportMigrationEmptyState } from './SuperadminDataImportMigrationEmptyState';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function SuperadminDataImportMigrationMain() {
  const {
    batches,
    isBatchesPending,
    batchesError,
    activePreflightResult,
    runPreflight,
    isValidating,
    commitImport,
    isCommitting,
    rollbackBatch,
    isRollingBack,
    clearPreflight,
    filterStatus,
    setFilterStatus,
    resetFilters,
  } = useSuperadminDataImportMigration();

  if (isBatchesPending) {
    return <SuperadminDataImportMigrationSkeleton />;
  }

  if (batchesError) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="text-xs font-medium">
            Failed to load migration batches: {batchesError.message}
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

  return (
    <div className="space-y-6">
      {/* 1. Migration Ingestion Wizard (Feature 9) */}
      <SuperadminDataImportMigrationUploadWizard
        onRunPreflight={runPreflight}
        isValidating={isValidating}
      />

      {/* 2. Pre-flight Dry-Run & Duplicate Validation Card (Feature 10) */}
      {activePreflightResult && (
        <SuperadminDataImportMigrationValidationCard
          result={activePreflightResult}
          onCommit={(takeRollbackSnapshot) =>
            commitImport({
              preflightId: activePreflightResult.preflightId,
              tenantId: 'tnt-delhi-central',
              entityType: activePreflightResult.entityType,
              duplicateStrategy: 'SKIP',
              takeRollbackSnapshot,
            })
          }
          onDismiss={clearPreflight}
          isCommitting={isCommitting}
        />
      )}

      {/* 3. Migration Batch Tracking & Rollback Center (Feature 11) */}
      {batches.length === 0 ? (
        <SuperadminDataImportMigrationEmptyState onResetFilters={resetFilters} />
      ) : (
        <SuperadminDataImportMigrationHistoryTable
          batches={batches}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onRollbackBatch={rollbackBatch}
          isRollingBack={isRollingBack}
        />
      )}
    </div>
  );
}
