import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_MEMBERS_BLACKLIST_API } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import { ADMIN_BLACKLIST_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import { AdminBlacklistApiResponseSchema } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';

export class AdminBlacklistApiContractMissingError extends Error {
  constructor() {
    super('Blacklist API endpoint/response contract is not supplied; no request was sent.');
    this.name = 'AdminBlacklistApiContractMissingError';
  }
}

/** Maps only schema-supported fields; absent or blank display data is shown as unknown. */
export function nonBlankAdminBlacklistDisplayValue(value: string | undefined): string { return value?.trim() || '—'; }
const nonBlank = nonBlankAdminBlacklistDisplayValue;

export async function fetchAdminBlacklist(): Promise<AdminBlacklistRecord[]> {
  const endpoint = ADMIN_MEMBERS_BLACKLIST_API.LIST;
  if (!endpoint) throw new AdminBlacklistApiContractMissingError();

  const payload = parseApiResponseData(
    await apiFetch<unknown>(endpoint),
    AdminBlacklistApiResponseSchema,
  );
  return payload.map((record) => ({
    id: String(record.id),
    name: nonBlank(record.name) !== '—' ? nonBlank(record.name) : nonBlank(record.fullName),
    phone: nonBlank(record.phone),
    reason: nonBlank(record.reason),
    blacklistedBy: nonBlank(record.blacklistedBy),
    blacklistedOn: nonBlank(record.blacklistedOn) !== '—' ? nonBlank(record.blacklistedOn) : nonBlank(record.date),
    previousSeat: nonBlank(record.previousSeat),
    status: ADMIN_BLACKLIST_STATUS_VALUES[0],
  }));
}

/** Feature-scoped TanStack Query keys for admin_blacklist. Keep server-state cache ownership inside this feature. */

