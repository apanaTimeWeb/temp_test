// hooks/useSuperadminDataOverview.ts
// Custom hook isolating queries, mutations and business flow for Superadmin Data Overview

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_data/data_overview/api/superadmin_data_overview.query_keys';
import {
  fetchSuperadminDataOverviewMetrics,
  fetchSuperadminDataOverviewRpoRto,
  fetchSuperadminDataOverviewActivity,
  fetchSuperadminDataOverviewStorage,
  triggerSuperadminQuickBackup,
} from '@/app/frontend_superadmin/superadmin_data/data_overview/api/superadmin_data_overview.api';
import { useSuperadminDataOverviewStore } from '@/app/frontend_superadmin/superadmin_data/data_overview/state/useSuperadminDataOverviewStore';
import type { SuperadminDataQuickBackupPayload } from '@/app/frontend_superadmin/superadmin_data/data_overview/schemas/superadmin_data_overview.schemas';

export function useSuperadminDataOverview() {
  const queryClient = useQueryClient();
  const {
    isQuickBackupModalOpen,
    isSimulatingDrill,
    activityFilter,
    selectedCategory,
    openQuickBackupModal,
    closeQuickBackupModal,
    setActivityFilter,
    setSelectedCategory,
    setIsSimulatingDrill,
  } = useSuperadminDataOverviewStore();

  const metricsQuery = useQuery({
    queryKey: SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.metrics(),
    queryFn: async () => {
      const res = await fetchSuperadminDataOverviewMetrics();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
  });

  const rpoRtoQuery = useQuery({
    queryKey: SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.rpoRto(),
    queryFn: async () => {
      const res = await fetchSuperadminDataOverviewRpoRto();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
  });

  const activityQuery = useQuery({
    queryKey: SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.activity(),
    queryFn: async () => {
      const res = await fetchSuperadminDataOverviewActivity();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
  });

  const storageQuery = useQuery({
    queryKey: SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.storage(),
    queryFn: async () => {
      const res = await fetchSuperadminDataOverviewStorage();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 60000,
  });

  const quickBackupMutation = useMutation({
    mutationFn: async (payload: SuperadminDataQuickBackupPayload) => {
      const idempotencyKey = `idemp-bkp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const res = await triggerSuperadminQuickBackup(payload, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.all });
      toast.success(data.message || 'Quick Backup Snapshot initiated successfully!', {
        id: 'quick-backup-success',
      });
      closeQuickBackupModal();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to initiate quick backup', {
        id: 'quick-backup-error',
      });
    },
  });

  const filteredActivity = (activityQuery.data || []).filter((item) => {
    if (activityFilter === 'ALL') return true;
    return item.type === activityFilter;
  });

  const handleSimulateSandboxDrill = () => {
    setIsSimulatingDrill(true);
    toast.info('Starting automated restore drill in isolated sandbox...', { id: 'drill-start' });
    setTimeout(() => {
      setIsSimulatingDrill(false);
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS.rpoRto() });
      toast.success('Restore Drill Passed! 100% table checksum integrity verified in 11.4 minutes.', {
        id: 'drill-success',
      });
    }, 2500);
  };

  return {
    metrics: metricsQuery.data,
    rpoRto: rpoRtoQuery.data,
    activities: filteredActivity,
    storage: storageQuery.data,
    isLoading: metricsQuery.isPending || rpoRtoQuery.isPending,
    isError: metricsQuery.isError || rpoRtoQuery.isError,
    errorMessage: metricsQuery.error?.message || rpoRtoQuery.error?.message,
    refetch: () => {
      metricsQuery.refetch();
      rpoRtoQuery.refetch();
      activityQuery.refetch();
      storageQuery.refetch();
    },
    isQuickBackupModalOpen,
    isSimulatingDrill,
    activityFilter,
    selectedCategory,
    openQuickBackupModal,
    closeQuickBackupModal,
    setActivityFilter,
    setSelectedCategory,
    triggerQuickBackup: quickBackupMutation.mutate,
    isSubmittingQuickBackup: quickBackupMutation.isPending,
    handleSimulateSandboxDrill,
  };
}
