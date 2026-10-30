import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import { parseApiResponseData } from '@/lib/apiSchema';
import { ADMIN_SYSTEM_SETTINGS_API } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';


export interface AdminSystemApiRecord {
  id?: string | number;
  [key: string]: unknown;
}

const AdminSystemApiRecordSchema = z.object({ id: z.union([z.string(), z.number()]).optional() }).passthrough();

const AdminSystemApiResponseSchema = z.array(AdminSystemApiRecordSchema);

/** Typed feature-owned transport boundary. Exact backend fields remain constrained by the supplied frontend scope. */
export async function fetchAdminSystem(): Promise<AdminSystemApiRecord[]> {
  const payload = await apiFetch<unknown>(ADMIN_SYSTEM_SETTINGS_API.LIST);
  return parseApiResponseData(payload, AdminSystemApiResponseSchema);
}


/** Module-owned TanStack Query v5 keys for system settings; never shared with sibling modules. */



// Form/API boundary schema exports are co-located for this isolated module.
export interface AdminSystemSettingsValidationMessages {
  appNameRequired: string;
  appNameTooLong: string;
  upiIdRequired: string;
  upiIdTooLong: string;
  apiKeyTooLong: string;
}

const DEFAULT_MESSAGES: AdminSystemSettingsValidationMessages = {
  appNameRequired: 'App name is required',
  appNameTooLong: 'App name must be 120 characters or fewer',
  upiIdRequired: 'UPI ID is required',
  upiIdTooLong: 'UPI ID must be 120 characters or fewer',
  apiKeyTooLong: 'API key must be 500 characters or fewer',
};

export function createAdminSystemSettingsSchema(messages: AdminSystemSettingsValidationMessages) {
  return z.object({
    appName: z.string().trim().min(1, messages.appNameRequired).max(120, messages.appNameTooLong),
    upiId: z.string().trim().min(1, messages.upiIdRequired).max(120, messages.upiIdTooLong),
    acceptCash: z.boolean(),
    acceptUpi: z.boolean(),
    acceptCard: z.boolean(),
    acceptBank: z.boolean(),
    apiKey: z.string().max(500, messages.apiKeyTooLong),
  });
}

export const AdminSystemSettingsSchema = createAdminSystemSettingsSchema(DEFAULT_MESSAGES);
export type AdminSystemSettingsInput = z.infer<typeof AdminSystemSettingsSchema>;

/** Form values are inferred from the canonical schema rather than maintained as a duplicate field list. */
export type AdminSystemSettingsFormValues = AdminSystemSettingsInput;
