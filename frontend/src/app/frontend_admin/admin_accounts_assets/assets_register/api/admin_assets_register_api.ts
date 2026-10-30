import { z } from 'zod';
import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_ASSETS_REGISTER_API } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';

const AdminAssetsRegisterApiRecordSchema = z.object({ id: z.union([z.string(), z.number()]).optional() }).passthrough();
const AdminAssetsRegisterApiResponseSchema = z.array(AdminAssetsRegisterApiRecordSchema);
export type AdminAssetsRegisterApiRecord = z.infer<typeof AdminAssetsRegisterApiRecordSchema>;

/** Existing generic accounting transport; not wired to the demo view until an asset DTO is verified. */
export async function fetchAdminAssetsRegisterRecords(): Promise<AdminAssetsRegisterApiRecord[]> {
  const payload = await apiFetch<unknown>(ADMIN_ASSETS_REGISTER_API.list);
  return parseApiResponseData(payload, AdminAssetsRegisterApiResponseSchema);
}

/** Server-state key registry remains feature-local; activation waits for a verified asset API contract. */

