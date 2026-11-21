// RESPONSIBILITY: Define the typed API/query boundary for settings general with canonical envelope contracts and idempotency.
// FLOW: Feature caller -> superadmin_settings/settings_general/api/superadmin_settings_general.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling.
import { apiFetch, type ApiResponse } from '@/lib/api';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import { SUPERADMIN_SETTINGS_GENERAL_API } from '@/app/frontend_superadmin/superadmin_settings/settings_general/config/superadmin_settings_general.url_config';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/mocks/fixtures/SuperadminSettingsGeneralPreviewDefaults';

/**
 * API boundary status for settings_general.
 * Retains required baseline contract indicators while enabling full MSW interceptable clients.
 */
export const SUPERADMIN_SETTINGS_GENERAL_API_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  source: 'SUPPLIED_FRONTEND_ARCHIVE',
  networkCallsEnabled: false,
  requiredInputs: ['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract'],
} as const;

/**
 * Fetches the global settings payload across all 11 settings domains.
 */
export async function fetchSuperadminSettingsGeneral(): Promise<ApiResponse<SuperadminSettingsFormValues>> {
  if (!SUPERADMIN_SETTINGS_GENERAL_API_CONTRACT_STATUS.networkCallsEnabled) {
    return {
      success: true,
      data: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
      message: 'Preview-only fixture loaded',
      requestId: 'req-settings-general-preview',
    };
  }
  return apiFetch<SuperadminSettingsFormValues>(SUPERADMIN_SETTINGS_GENERAL_API.get, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Updates global settings with client-side idempotency protection (UUIDv4).
 * @param payload Full or partial settings payload
 * @param idempotencyKey Deterministic or unique UUIDv4 string
 */
export async function updateSuperadminSettingsGeneral(
  payload: SuperadminSettingsFormValues,
  idempotencyKey?: string
): Promise<ApiResponse<SuperadminSettingsFormValues>> {
  const key = idempotencyKey ?? (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-default-key');
  if (!SUPERADMIN_SETTINGS_GENERAL_API_CONTRACT_STATUS.networkCallsEnabled) {
    return {
      success: true,
      data: payload,
      message: `Preview settings updated with idempotency key: ${key}`,
      requestId: 'req-settings-general-update',
    };
  }
  return apiFetch<SuperadminSettingsFormValues>(SUPERADMIN_SETTINGS_GENERAL_API.update, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Resets global settings to system factory defaults.
 */
export async function resetSuperadminSettingsGeneral(idempotencyKey?: string): Promise<ApiResponse<SuperadminSettingsFormValues>> {
  const key = idempotencyKey ?? (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-reset-key');
  if (!SUPERADMIN_SETTINGS_GENERAL_API_CONTRACT_STATUS.networkCallsEnabled) {
    return {
      success: true,
      data: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
      message: 'Preview settings reset to defaults',
      requestId: 'req-settings-general-reset',
    };
  }
  return apiFetch<SuperadminSettingsFormValues>(SUPERADMIN_SETTINGS_GENERAL_API.reset, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
    },
  });
}
