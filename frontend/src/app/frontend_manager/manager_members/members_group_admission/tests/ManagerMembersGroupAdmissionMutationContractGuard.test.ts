import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api';
import { createManagerStudent } from '@/app/frontend_manager/manager_members/members_group_admission/api/manager_members_group_admission.api';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));

describe('student admission contract guard', () => {
  beforeEach(() => vi.resetAllMocks());

  it('fails closed without issuing a POST when the host contract is absent', async () => {
    await expect(createManagerStudent({ opaque: true })).rejects.toThrow(/BLOCKED BY SUPPLIED SCOPE/);
    expect(apiFetch).not.toHaveBeenCalled();
  });
});
