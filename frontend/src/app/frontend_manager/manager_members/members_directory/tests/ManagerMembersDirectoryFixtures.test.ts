import { describe, expect, it } from 'vitest';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
import { createManagerMemberDirectoryDemoRecord, getNextManagerMemberDirectoryDemoId } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryDemoRepository';
import { ManagerMembersDirectoryDemoCreateSchema } from '@/app/frontend_manager/manager_members/members_directory/schemas/ManagerMembersDirectoryDemoSchema';

const validInput = {
  name: '  Test Member  ',
  phone: '  9000000000 ',
  email: 'test@example.com',
  address: 'Test address',
  dob: '2000-01-01',
  gender: 'Other' as const,
  department: 'Demo',
  membershipType: 'Basic' as const,
  joinDate: '2026-01-01',
  expiryDate: '2027-01-01',
  guardian: '',
  emergencyContact: '',
};

describe('ManagerMembersDirectoryFixtures and demo repository', () => {
  it('contains unique stable demo record identifiers', () => {
    const ids = MANAGER_MEMBERS_DEMO_RECORDS.map((member) => member.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('accepts the valid demo form contract', () => {
    expect(ManagerMembersDirectoryDemoCreateSchema.safeParse(validInput).success).toBe(true);
  });

  it('rejects an invalid email before creating a demo record', () => {
    expect(ManagerMembersDirectoryDemoCreateSchema.safeParse({ ...validInput, email: 'not-an-email' }).success).toBe(false);
  });

  it('creates a distinct in-memory demo record without mutating the fixture list', () => {
    const before = MANAGER_MEMBERS_DEMO_RECORDS.length;
    const created = createManagerMemberDirectoryDemoRecord(validInput, MANAGER_MEMBERS_DEMO_RECORDS);
    expect(created).toMatchObject({
      id: 'DEMO-LIB-001',
      name: 'Test Member',
      phone: '9000000000',
      type: 'Basic',
      status: 'Active',
      joinDate: '2026-01-01',
      expiryDate: '2027-01-01',
    });
    expect(MANAGER_MEMBERS_DEMO_RECORDS).toHaveLength(before);
  });

  it('allocates the next sequence after existing demo records', () => {
    const existing = [
      ...MANAGER_MEMBERS_DEMO_RECORDS,
      createManagerMemberDirectoryDemoRecord(validInput, MANAGER_MEMBERS_DEMO_RECORDS),
    ];
    expect(getNextManagerMemberDirectoryDemoId(existing)).toBe('DEMO-LIB-002');
  });

  it.each([
    { label: 'name', input: { ...validInput, name: '   ' } },
    { label: 'phone', input: { ...validInput, phone: '  ' } },
    { label: 'join date', input: { ...validInput, joinDate: '' } },
    { label: 'expiry date', input: { ...validInput, expiryDate: '' } },
  ])('rejects a demo record with missing $label', ({ input }) => {
    expect(() => createManagerMemberDirectoryDemoRecord(input, MANAGER_MEMBERS_DEMO_RECORDS)).toThrow();
  });
});
