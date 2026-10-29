import { describe, expect, it } from 'vitest';
import { MANAGER_CRM_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.query_keys';

describe('ManagerMembersEnquiriesQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_CRM_QUERY_KEYS.enquiries()[0]).toBe('manager_enquiries');
    expect(MANAGER_CRM_QUERY_KEYS.enquiry('id-1')[0]).toBe('manager_enquiries');
    expect(MANAGER_CRM_QUERY_KEYS.enquiries()).not.toEqual(MANAGER_CRM_QUERY_KEYS.enquiry('id-1'));
  });
});
