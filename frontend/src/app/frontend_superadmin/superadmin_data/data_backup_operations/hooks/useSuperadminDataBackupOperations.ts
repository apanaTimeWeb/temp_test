// hooks/useSuperadminDataBackupOperations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/api/superadmin_data_backup_operations.query_keys';
import {
  fetchSuperadminBackupSchedules,
  createSuperadminBackupSchedule,
  toggleSuperadminBackupScheduleStatus,
  triggerSuperadminFullPlatformBackup,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/api/superadmin_data_backup_operations.api';
import { useSuperadminDataBackupOperationsStore } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/state/useSuperadminDataBackupOperationsStore';
import type {
  SuperadminBackupScheduleFormValues,
  SuperadminFullPlatformBackupFormValues,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/schemas/superadmin_data_backup_operations.schemas';

export function useSuperadminDataBackupOperations() {
  const queryClient = useQueryClient();
  const {
    isCreateScheduleModalOpen,
    isFullBackupModalOpen,
    selectedScheduleForEdit,
    searchFilter,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    openFullBackupModal,
    closeFullBackupModal,
    setSearchFilter,
  } = useSuperadminDataBackupOperationsStore();

  const schedulesQuery = useQuery({
    queryKey: SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS.schedules(),
    queryFn: async () => {
      const res = await fetchSuperadminBackupSchedules();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (values: SuperadminBackupScheduleFormValues) => {
      const idempotencyKey = `idemp-sched-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const res = await createSuperadminBackupSchedule(values, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS.schedules() });
      toast.success(data.message || 'Backup policy schedule created successfully!', { id: 'create-schedule-ok' });
      closeCreateScheduleModal();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create backup policy schedule', { id: 'create-schedule-err' });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const idempotencyKey = `idemp-tog-${id}-${Date.now()}`;
      const res = await toggleSuperadminBackupScheduleStatus(id, isActive, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS.schedules() });
      toast.success('Backup schedule status updated!', { id: 'toggle-status-ok' });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update schedule status', { id: 'toggle-status-err' });
    },
  });

  const fullBackupMutation = useMutation({
    mutationFn: async (values: SuperadminFullPlatformBackupFormValues) => {
      const idempotencyKey = `idemp-full-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const res = await triggerSuperadminFullPlatformBackup(values, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS.all });
      toast.success(data.message || 'Full Platform Backup snapshot initiated!', { id: 'full-backup-ok' });
      closeFullBackupModal();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to trigger full platform backup', { id: 'full-backup-err' });
    },
  });

  const filteredSchedules = (schedulesQuery.data || []).filter((s) => {
    if (!searchFilter.trim()) return true;
    return s.name.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return {
    schedules: filteredSchedules,
    isLoading: schedulesQuery.isPending,
    isError: schedulesQuery.isError,
    errorMessage: schedulesQuery.error?.message,
    refetch: () => schedulesQuery.refetch(),
    searchFilter,
    setSearchFilter,
    isCreateScheduleModalOpen,
    isFullBackupModalOpen,
    selectedScheduleForEdit,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    openFullBackupModal,
    closeFullBackupModal,
    createSchedule: createScheduleMutation.mutate,
    isCreatingSchedule: createScheduleMutation.isPending,
    toggleSchedule: (id: string, isActive: boolean) => toggleStatusMutation.mutate({ id, isActive }),
    triggerFullPlatformBackup: fullBackupMutation.mutate,
    isSubmittingFullBackup: fullBackupMutation.isPending,
  };
}
