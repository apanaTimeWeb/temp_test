// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/hooks/useSuperadminDataImportMigration.ts
/**
 * @file useSuperadminDataImportMigration.ts
 * @description Hook managing data queries and mutations for Import Management,
 * Pre-flight Validation, and Rollback Snapshots.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminDataImportMigrationKeys } from '@/app/frontend_superadmin/superadmin_data/data_import_migration/api/superadmin_data_import_migration.query_keys';
import {
  fetchImportOverview,
  fetchImportBatches,
  runPreflightValidation,
  commitImportBatch,
  rollbackImportBatch,
} from '@/app/frontend_superadmin/superadmin_data/data_import_migration/api/superadmin_data_import_migration.api';
import { useSuperadminDataImportMigrationStore } from '@/app/frontend_superadmin/superadmin_data/data_import_migration/state/useSuperadminDataImportMigrationStore';
import type {
  PreflightValidatePayload,
  CommitImportPayload,
} from '@/app/frontend_superadmin/superadmin_data/data_import_migration/types/superadmin_data_import_migration.types';

export function useSuperadminDataImportMigration() {
  const queryClient = useQueryClient();
  const {
    activePreflightResult,
    filterStatus,
    filterTenant,
    setActivePreflightResult,
    setFilterStatus,
    setFilterTenant,
    clearPreflight,
    resetFilters,
  } = useSuperadminDataImportMigrationStore();

  const overviewQuery = useQuery({
    queryKey: superadminDataImportMigrationKeys.overview(),
    queryFn: fetchImportOverview,
    staleTime: 60 * 1000,
  });

  const batchesQuery = useQuery({
    queryKey: superadminDataImportMigrationKeys.batches({ status: filterStatus, tenantId: filterTenant }),
    queryFn: () => fetchImportBatches({ status: filterStatus, tenantId: filterTenant }),
    staleTime: 15 * 1000,
  });

  const preflightMutation = useMutation({
    mutationFn: (payload: PreflightValidatePayload) => runPreflightValidation(payload),
    onSuccess: (data) => {
      setActivePreflightResult(data);
    },
  });

  const commitMutation = useMutation({
    mutationFn: (payload: CommitImportPayload) => commitImportBatch(payload),
    onSuccess: () => {
      clearPreflight();
      queryClient.invalidateQueries({ queryKey: superadminDataImportMigrationKeys.batches() });
      queryClient.invalidateQueries({ queryKey: superadminDataImportMigrationKeys.overview() });
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: (batchId: string) => rollbackImportBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminDataImportMigrationKeys.batches() });
      queryClient.invalidateQueries({ queryKey: superadminDataImportMigrationKeys.overview() });
    },
  });

  return {
    overview: overviewQuery.data,
    isOverviewPending: overviewQuery.isPending,
    overviewError: overviewQuery.error,

    batches: batchesQuery.data ?? [],
    isBatchesPending: batchesQuery.isPending,
    batchesError: batchesQuery.error,

    runPreflight: preflightMutation.mutate,
    isValidating: preflightMutation.isPending,
    preflightError: preflightMutation.error,

    commitImport: commitMutation.mutate,
    isCommitting: commitMutation.isPending,
    commitError: commitMutation.error,

    rollbackBatch: rollbackMutation.mutate,
    isRollingBack: rollbackMutation.isPending,
    rollbackError: rollbackMutation.error,

    // Store state & controls
    activePreflightResult,
    filterStatus,
    filterTenant,
    setActivePreflightResult,
    setFilterStatus,
    setFilterTenant,
    clearPreflight,
    resetFilters,
  };
}
