// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/hooks/useSuperadminDataExportManagement.ts
/**
 * @file useSuperadminDataExportManagement.ts
 * @description Hook managing data queries and mutations for Tenant & Branch Data Export.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminDataExportManagementKeys } from '@/app/frontend_superadmin/superadmin_data/data_export_management/api/superadmin_data_export_management.query_keys';
import {
  fetchExportOverview,
  fetchExportJobs,
  fetchExportTenants,
  fetchExportBranches,
  triggerDataExport,
  cancelExportJob,
} from '@/app/frontend_superadmin/superadmin_data/data_export_management/api/superadmin_data_export_management.api';
import { useSuperadminDataExportManagementStore } from '@/app/frontend_superadmin/superadmin_data/data_export_management/state/useSuperadminDataExportManagementStore';
import type { CreateExportPayload } from '@/app/frontend_superadmin/superadmin_data/data_export_management/types/superadmin_data_export_management.types';

export function useSuperadminDataExportManagement() {
  const queryClient = useQueryClient();
  const {
    isExportModalOpen,
    preselectedScope,
    preselectedTenantId,
    preselectedBranchId,
    filterScope,
    filterStatus,
    openExportModal,
    closeExportModal,
    setFilterScope,
    setFilterStatus,
    resetFilters,
  } = useSuperadminDataExportManagementStore();

  const overviewQuery = useQuery({
    queryKey: superadminDataExportManagementKeys.overview(),
    queryFn: fetchExportOverview,
    staleTime: 60 * 1000,
  });

  const jobsQuery = useQuery({
    queryKey: superadminDataExportManagementKeys.jobs({ scope: filterScope, status: filterStatus }),
    queryFn: () => fetchExportJobs({ scope: filterScope, status: filterStatus }),
    staleTime: 15 * 1000,
  });

  const tenantsQuery = useQuery({
    queryKey: superadminDataExportManagementKeys.tenants(),
    queryFn: fetchExportTenants,
    staleTime: 5 * 60 * 1000,
  });

  const branchesQuery = useQuery({
    queryKey: superadminDataExportManagementKeys.branches(),
    queryFn: () => fetchExportBranches(),
    staleTime: 5 * 60 * 1000,
  });

  const exportMutation = useMutation({
    mutationFn: (payload: CreateExportPayload) => triggerDataExport(payload),
    onSuccess: () => {
      closeExportModal();
      queryClient.invalidateQueries({ queryKey: superadminDataExportManagementKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: superadminDataExportManagementKeys.overview() });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelExportJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminDataExportManagementKeys.jobs() });
    },
  });

  return {
    overview: overviewQuery.data,
    isOverviewPending: overviewQuery.isPending,
    overviewError: overviewQuery.error,

    jobs: jobsQuery.data ?? [],
    isJobsPending: jobsQuery.isPending,
    jobsError: jobsQuery.error,

    tenants: tenantsQuery.data ?? [],
    isTenantsPending: tenantsQuery.isPending,

    branches: branchesQuery.data ?? [],
    isBranchesPending: branchesQuery.isPending,

    triggerExport: exportMutation.mutate,
    isTriggeringExport: exportMutation.isPending,
    exportError: exportMutation.error,

    cancelExport: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,

    // Store state & controls
    isExportModalOpen,
    preselectedScope,
    preselectedTenantId,
    preselectedBranchId,
    filterScope,
    filterStatus,
    openExportModal,
    closeExportModal,
    setFilterScope,
    setFilterStatus,
    resetFilters,
  };
}
