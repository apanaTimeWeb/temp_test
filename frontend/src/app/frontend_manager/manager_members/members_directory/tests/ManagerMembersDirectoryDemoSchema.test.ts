import { describe, expect, it } from 'vitest';
import { ManagerMembersDirectoryDemoCreateSchema } from '@/app/frontend_manager/manager_members/members_directory/schemas/ManagerMembersDirectoryDemoSchema';

const validMember = {
  name: 'Sample Member', phone: '9000000000', email: '', address: '', dob: '', gender: 'Male' as const,
  department: '', membershipType: 'Pro' as const, joinDate: '2026-01-01', expiryDate: '2026-02-01', guardian: '', emergencyContact: '',
};

describe('ManagerMembersDirectoryDemoCreateSchema', () => {
  it('accepts a valid local draft', () => {
    expect(ManagerMembersDirectoryDemoCreateSchema.safeParse(validMember).success).toBe(true);
  });
  it('rejects impossible date-only values', () => {
    expect(ManagerMembersDirectoryDemoCreateSchema.safeParse({ ...validMember, joinDate: '2026-02-30' }).success).toBe(false);
  });
  it('requires expiry to follow the join date', () => {
    const result = ManagerMembersDirectoryDemoCreateSchema.safeParse({ ...validMember, expiryDate: '2026-01-01' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === 'expiryDate')).toBe(true);
  });
});
