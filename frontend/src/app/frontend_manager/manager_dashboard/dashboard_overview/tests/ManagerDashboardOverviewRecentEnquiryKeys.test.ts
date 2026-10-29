import { describe, expect, it } from 'vitest';
import { createManagerDashboardRecentEnquiryKeys } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewRecentEnquiryKeys';

describe('ManagerDashboardOverviewRecentEnquiryKeys', () => {
  it('prefers authoritative IDs and prevents collisions when the API has duplicate identity fields', () => {
    const duplicate = { name: 'Priya', phone: '98••••10', status: 'New' as const };
    const keys = createManagerDashboardRecentEnquiryKeys([duplicate, duplicate, { ...duplicate, id: 'enq-3' }]);
    expect(new Set(keys).size).toBe(3);
    expect(keys[2]).toBe('id:enq-3');
    expect(keys[0]).not.toBe(keys[1]);
    expect(new Set(createManagerDashboardRecentEnquiryKeys([{ ...duplicate, id: 'same' }, { ...duplicate, id: 'same' }])).size).toBe(2);
  });
});
