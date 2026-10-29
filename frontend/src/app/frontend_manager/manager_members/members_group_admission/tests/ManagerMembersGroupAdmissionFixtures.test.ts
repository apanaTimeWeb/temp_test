import { describe, expect, it } from 'vitest';
import { MANAGER_STUDENTS_FIXTURES } from '@/app/frontend_manager/manager_members/members_group_admission/mocks/manager_members_group_admission_fixtures/ManagerMembersGroupAdmissionFixtures';

describe('ManagerMembersGroupAdmissionFixtures', () => {
  it('provides unique stable identifiers for all sample students', () => {
    const ids = MANAGER_STUDENTS_FIXTURES.map((student) => student.id);
    const smartIds = MANAGER_STUDENTS_FIXTURES.map((student) => student.smartId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(smartIds).size).toBe(smartIds.length);
  });

  it('covers status, shift, plan, branch, and due-balance variations for list states', () => {
    expect(new Set(MANAGER_STUDENTS_FIXTURES.map((student) => student.status))).toEqual(new Set(['Active', 'Suspended', 'Expired']));
    expect(new Set(MANAGER_STUDENTS_FIXTURES.map((student) => student.shift)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(MANAGER_STUDENTS_FIXTURES.map((student) => student.plan)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(MANAGER_STUDENTS_FIXTURES.map((student) => student.branch)).size).toBeGreaterThanOrEqual(3);
    expect(MANAGER_STUDENTS_FIXTURES.some((student) => student.dueMinor === 0)).toBe(true);
    expect(MANAGER_STUDENTS_FIXTURES.some((student) => student.dueMinor > 0)).toBe(true);
    expect(MANAGER_STUDENTS_FIXTURES.some((student) => student.seat === '—')).toBe(true);
  });

  it('uses non-negative integer minor-unit balances and non-empty currency codes', () => {
    for (const student of MANAGER_STUDENTS_FIXTURES) {
      expect(Number.isInteger(student.dueMinor)).toBe(true);
      expect(student.dueMinor).toBeGreaterThanOrEqual(0);
      expect(student.currency.trim()).not.toBe('');
    }
  });
});
