import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import type { ManagerMembersDirectoryDemoCreateInput } from '@/app/frontend_manager/manager_members/members_directory/schemas/ManagerMembersDirectoryDemoSchema';

/**
 * Produces a display-only identifier for a new mock member.
 * It is deliberately not a production/member-system ID and is not persisted.
 */
export function getNextManagerMemberDirectoryDemoId(records: readonly ManagerMembersDirectoryRecord[]): string {
  const largestSequence = records.reduce((largest, record) => {
    const match = /^DEMO-LIB-(\d+)$/.exec(record.id);
    return match ? Math.max(largest, Number(match[1])) : largest;
  }, 0);
  return `DEMO-LIB-${String(largestSequence + 1).padStart(3, '0')}`;
}

/**
 * Creates a new feature-owned demo record without mutating the input array.
 * This must never be treated as a live API write or as evidence of persistence.
 */
export function createManagerMemberDirectoryDemoRecord(
  input: ManagerMembersDirectoryDemoCreateInput,
  records: readonly ManagerMembersDirectoryRecord[],
): ManagerMembersDirectoryRecord {
  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name) throw new Error('Enter a member name to create a demo record.');
  if (!phone) throw new Error('Enter a phone number to create a demo record.');
  if (!input.joinDate) throw new Error('Choose a join date to create a demo record.');
  if (!input.expiryDate) throw new Error('Choose an expiry date to create a demo record.');

  return {
    id: getNextManagerMemberDirectoryDemoId(records),
    name,
    phone,
    email: input.email.trim(),
    type: input.membershipType,
    status: 'Active',
    joinDate: input.joinDate,
    expiryDate: input.expiryDate,
    address: input.address.trim(),
    dob: input.dob,
    gender: input.gender,
    department: input.department.trim(),
    guardian: input.guardian.trim(),
    emergencyContact: input.emergencyContact.trim(),
  };
}

/** Returns a defensive copy of module-owned sample records; no persistence is implied. */
export function getManagerMemberDirectoryDemoRecords(): ManagerMembersDirectoryRecord[] {
  return MANAGER_MEMBERS_DEMO_RECORDS.map((record) => ({ ...record }));
}
