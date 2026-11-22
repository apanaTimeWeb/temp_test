// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/hooks/useSuperadminDataRestoreOperations.ts
/**
 * @file useSuperadminDataRestoreOperations.ts
 * @description Master data hook orchestrating queries and mutations for Backup History,
 * Point-in-time Restore, and Sandbox Drills.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminDataRestoreOperationsKeys } from '../api/superadmin_data_restore_operations.query_keys';
import {
  fetchRestoreOverview,
  fetchBackupSnapshots,
  fetchDrillHistory,
  executeRestore,
  triggerSandboxDrill,
} from '../api/superadmin_data_restore_operations.api';
import { useSuperadminDataRestoreOperationsStore } from '../state/useSuperadminDataRestoreOperationsStore';
import type { RestoreExecutionRequest } from '../types/superadmin_data_restore_operations.types';

export function useSuperadminDataRestoreOperations() {
  const queryClient = useQueryClient();
  const {
    selectedSnapshot,
    scopeFilter,
    searchQuery,
    isRestoreModalOpen,
    isDrillModalOpen,
    activeRestoreJobId,
    setSelectedSnapshot,
    setScopeFilter,
    setSearchQuery,
    openRestoreModal,
    closeRestoreModal,
    openDrillModal,
    closeDrillModal,
    setActiveRestoreJobId,
    resetFilters,
  } = useSuperadminDataRestoreOperationsStore();

  const overviewQuery = useQuery({
    queryKey: superadminDataRestoreOperationsKeys.overview(),
    queryFn: fetchRestoreOverview,
    staleTime: 60 * 1000,
  });

  const snapshotsQuery = useQuery({
    queryKey: superadminDataRestoreOperationsKeys.snapshots({ scope: scopeFilter, search: searchQuery }),
    queryFn: () => fetchBackupSnapshots({ scope: scopeFilter, search: searchQuery }),
    staleTime: 30 * 1000,
  });

  const drillsQuery = useQuery({
    queryKey: superadminDataRestoreOperationsKeys.drills(),
    queryFn: fetchDrillHistory,
    staleTime: 60 * 1000,
  });

  const restoreMutation = useMutation({
    mutationFn: (payload: RestoreExecutionRequest) => executeRestore(payload),
    onSuccess: (data) => {
      setActiveRestoreJobId(data.restoreJobId);
      closeRestoreModal();
      queryClient.invalidateQueries({ queryKey: superadminDataRestoreOperationsKeys.all });
    },
  });

  const drillMutation = useMutation({
    mutationFn: ({ snapshotId, notes }: { snapshotId: string; notes: string }) =>
      triggerSandboxDrill(snapshotId, notes),
    onSuccess: () => {
      closeDrillModal();
      queryClient.invalidateQueries({ queryKey: superadminDataRestoreOperationsKeys.drills() });
      queryClient.invalidateQueries({ queryKey: superadminDataRestoreOperationsKeys.overview() });
    },
  });

  return {
    overview: overviewQuery.data,
    isOverviewPending: overviewQuery.isPending,
    overviewError: overviewQuery.error,

    snapshots: snapshotsQuery.data ?? [],
    isSnapshotsPending: snapshotsQuery.isPending,
    snapshotsError: snapshotsQuery.error,

    drills: drillsQuery.data ?? [],
    isDrillsPending: drillsQuery.isPending,
    drillsError: drillsQuery.error,

    executeRestore: restoreMutation.mutate,
    isRestoring: restoreMutation.isPending,
    restoreError: restoreMutation.error,

    triggerDrill: drillMutation.mutate,
    isTriggeringDrill: drillMutation.isPending,
    drillError: drillMutation.error,

    // Store state & setters
    selectedSnapshot,
    scopeFilter,
    searchQuery,
    isRestoreModalOpen,
    isDrillModalOpen,
    activeRestoreJobId,
    setSelectedSnapshot,
    setScopeFilter,
    setSearchQuery,
    openRestoreModal,
    closeRestoreModal,
    openDrillModal,
    closeDrillModal,
    resetFilters,
  };
}
