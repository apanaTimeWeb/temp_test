import { describe, expect, it } from 'vitest';
import { managerBranchInfoDraftSchema } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';

const validDraft = {
  branchName: 'Example Branch',
  branchCode: 'EX-01',
  address: 'Example address',
  phone: '+91 9876543210',
  email: 'branch@example.com',
  managerName: 'Example Manager',
  workingHours: '08:00-20:00',
  libraryLogo: '',
  establishmentDate: '2021-08-15',
  libraryType: 'Private',
  totalSeatingCapacity: 120,
  totalFloors: '2 Floors',
  totalShifts: '3 Shifts',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  supportPhone: '+91 9876543299',
  supportEmail: 'support@example.com',
  profileCreatedDate: '2023-01-15',
  lastUpdatedDate: '2026-10-25',
};

describe('managerBranchInfoDraftSchema', () => {
  it('accepts a complete local draft without asserting persistence', () => {
    expect(managerBranchInfoDraftSchema.safeParse(validDraft).success).toBe(true);
  });

  it('rejects blank names and invalid email addresses', () => {
    expect(managerBranchInfoDraftSchema.safeParse({ ...validDraft, branchName: ' ' }).success).toBe(false);
    expect(managerBranchInfoDraftSchema.safeParse({ ...validDraft, email: 'invalid' }).success).toBe(false);
    expect(managerBranchInfoDraftSchema.safeParse({ ...validDraft, supportEmail: 'invalid-support' }).success).toBe(false);
  });

  it('validates all branch operational and support fields', () => {
    const result = managerBranchInfoDraftSchema.safeParse(validDraft);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.libraryType).toBe('Private');
      expect(result.data.totalSeatingCapacity).toBe(120);
      expect(result.data.currency).toBe('INR (₹)');
      expect(result.data.timezone).toBe('Asia/Kolkata (IST)');
      expect(result.data.supportPhone).toBe('+91 9876543299');
    }
  });
});
