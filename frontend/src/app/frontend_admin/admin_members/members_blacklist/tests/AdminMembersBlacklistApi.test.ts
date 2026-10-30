import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/app/frontend_admin/lib/api';
import { fetchAdminBlacklist, AdminBlacklistApiContractMissingError, nonBlankAdminBlacklistDisplayValue } from '@/app/frontend_admin/admin_members/members_blacklist/api/admin_members_blacklist_api';
import { ADMIN_BLACKLIST_API_LIST } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import { ADMIN_BLACKLIST_MSW_HANDLERS } from '@/app/frontend_admin/admin_members/members_blacklist/mocks/scenarios/admin_members_blacklist.scenarios';

vi.mock('@/app/frontend_admin/lib/api', () => ({ apiFetch: vi.fn() }));

describe('fetchAdminBlacklist API contract boundary', () => {
  afterEach(() => vi.clearAllMocks());

  it('fails closed before transport until a verified endpoint and DTO contract are supplied', async () => {
    await expect(fetchAdminBlacklist()).rejects.toBeInstanceOf(AdminBlacklistApiContractMissingError);
    expect(ADMIN_BLACKLIST_API_LIST).toBeNull();
    expect(ADMIN_BLACKLIST_MSW_HANDLERS).toHaveLength(0);
    expect(apiFetch).not.toHaveBeenCalled();
  });
});

describe('blacklist display-value normalization', () => {
  it('uses the unknown-value fallback for empty and whitespace-only API strings', () => {
    expect(nonBlankAdminBlacklistDisplayValue('')).toBe('—');
    expect(nonBlankAdminBlacklistDisplayValue('   ')).toBe('—');
    expect(nonBlankAdminBlacklistDisplayValue(undefined)).toBe('—');
    expect(nonBlankAdminBlacklistDisplayValue('A name')).toBe('A name');
  });
});
