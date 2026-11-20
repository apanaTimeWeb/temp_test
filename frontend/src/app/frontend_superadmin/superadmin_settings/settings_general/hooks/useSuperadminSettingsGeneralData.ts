// RESPONSIBILITY: Fetch and cache global settings server state via TanStack Query v5; no business JSX in hooks.
// DATA FLOW: API -> useSuperadminSettingsGeneralData -> TanStack Query cache -> Component consumer
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/api/superadmin_settings_general.query_keys';
import { fetchSuperadminSettingsGeneral } from '@/app/frontend_superadmin/superadmin_settings/settings_general/api/superadmin_settings_general.api';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/mocks/fixtures/SuperadminSettingsGeneralPreviewDefaults';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

export function useSuperadminSettingsGeneralData() {
  return useQuery<SuperadminSettingsFormValues>({
    queryKey: SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS.all,
    queryFn: async () => {
      try {
        const response = await fetchSuperadminSettingsGeneral();
        if (response.success && response.data) {
          return response.data;
        }
        return SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS;
      } catch {
        return SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS;
      }
    },
    staleTime: 60_000,
    gcTime: 300_000,
    initialData: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
  });
}
