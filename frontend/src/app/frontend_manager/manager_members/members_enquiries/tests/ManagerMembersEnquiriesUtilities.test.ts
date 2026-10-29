import { describe, expect, it } from 'vitest';
import { getManagerEnquiriesInitials, maskManagerEnquiriesPhone, getManagerEnquiriesLocalDateInputMinimum } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';

describe('ManagerMembersEnquiriesUtilities', () => {
  it('masks phone numbers while keeping recognizable prefix/suffix', () => {
    expect(maskManagerEnquiriesPhone('+91 9876543210')).toBe('91****3210');
  });

  it('never returns a short or malformed phone value unmasked', () => {
    expect(maskManagerEnquiriesPhone('12345')).toBe('••••');
    expect(maskManagerEnquiriesPhone('not-a-phone')).toBe('—');
  });

  it('derives deterministic initials from a name', () => {
    expect(getManagerEnquiriesInitials('Priya Verma')).toBe('PV');
  });

  it('formats a date-input minimum using the local calendar day', () => {
    expect(getManagerEnquiriesLocalDateInputMinimum(new Date(2026, 9, 16, 0, 30))).toBe('2026-10-16');
  });
});
