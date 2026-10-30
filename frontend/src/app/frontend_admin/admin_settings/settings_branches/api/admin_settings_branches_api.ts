import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_SETTINGS_BRANCHES_API } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import type { AdminBranchesBranch } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';

import { AdminBranchesApiResponseSchema } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';

/** Typed feature-owned transport boundary. Exact backend fields are constrained by the current supplied frontend scope. */
export async function fetchAdminBranches(): Promise<AdminBranchesBranch[]> {
  const payload = parseApiResponseData(await apiFetch<unknown>(ADMIN_SETTINGS_BRANCHES_API.LIST), AdminBranchesApiResponseSchema);
  return payload.map((branch) => ({ ...branch, id: String(branch.id) }));
}

// Feature-scoped TanStack Query cache keys belong to this entity-family API contract.
/** Feature-scoped TanStack Query keys for admin_branches. Keep server-state cache ownership inside this feature. */

