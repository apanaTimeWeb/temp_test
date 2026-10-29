import { describe, expect, it } from 'vitest';
import { managerBranchInfoDraftSchema } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';

const validDraft = { branchName: 'Example Branch', branchCode: 'EX-01', address: 'Example address', phone: '+91 9876543210', email: 'branch@example.com', managerName: 'Example Manager', workingHours: '08:00-20:00' };

describe('managerBranchInfoDraftSchema', () => {
  it('accepts a complete local draft without asserting persistence', () => { expect(managerBranchInfoDraftSchema.safeParse(validDraft).success).toBe(true); });
  it('rejects blank names and invalid email addresses', () => {
    expect(managerBranchInfoDraftSchema.safeParse({ ...validDraft, branchName: ' ' }).success).toBe(false);
    expect(managerBranchInfoDraftSchema.safeParse({ ...validDraft, email: 'invalid' }).success).toBe(false);
  });
});
