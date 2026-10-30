import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/app/frontend_admin/lib/api';
import { fetchAdminPlans, AdminPlansApiContractMissingError } from '@/app/frontend_admin/admin_members/members_plans/api/admin_members_plans_api';
import { ADMIN_PLANS_API_LIST } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import { ADMIN_PLANS_MSW_HANDLERS } from '@/app/frontend_admin/admin_members/members_plans/mocks/scenarios/admin_members_plans.scenarios';

vi.mock('@/app/frontend_admin/lib/api', () => ({ apiFetch: vi.fn() }));

describe('fetchAdminPlans API contract boundary', () => {
  afterEach(() => vi.clearAllMocks());

  it('fails closed before transport when the backend endpoint/DTO contract is missing', async () => {
    await expect(fetchAdminPlans()).rejects.toBeInstanceOf(AdminPlansApiContractMissingError);
    expect(ADMIN_PLANS_API_LIST).toBeNull();
    expect(ADMIN_PLANS_MSW_HANDLERS).toHaveLength(0);
    expect(apiFetch).not.toHaveBeenCalled();
  });
});
