// RESPONSIBILITY: Perform global settings mutation with UUIDv4 Idempotency-Key and TanStack Query cache reconciliation.
// DATA FLOW: Form submit -> useSuperadminSettingsGeneralMutation -> API PATCH -> TanStack Query invalidation -> Toast feedback
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateSuperadminSettingsGeneral, resetSuperadminSettingsGeneral } from '@/app/frontend_superadmin/superadmin_settings/settings_general/api/superadmin_settings_general.api';
import { SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/api/superadmin_settings_general.query_keys';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

export function useSuperadminSettingsGeneralMutation() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (payload: SuperadminSettingsFormValues) => {
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `idemp-${Date.now()}`;
      return updateSuperadminSettingsGeneral(payload, idempotencyKey);
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS.all, variables);
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS.all });
      toast.success(response.message || 'Global settings saved successfully', { id: 'superadmin-settings-save-success' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save global settings', { id: 'superadmin-settings-save-error' });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `idemp-reset-${Date.now()}`;
      return resetSuperadminSettingsGeneral(idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS.all });
      toast.info('Settings restored to system baseline defaults', { id: 'superadmin-settings-reset-success' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset settings', { id: 'superadmin-settings-reset-error' });
    },
  });

  return {
    saveSettings: saveMutation.mutate,
    saveSettingsAsync: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    resetSettings: resetMutation.mutate,
    isResetting: resetMutation.isPending,
  };
}
