import { describe, expect, it } from 'vitest';
import { normalizeManagerSeatsAllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/utils/ManagerLockersManagementStatusNormalization';

describe('ManagerLockersManagementStatusNormalization', () => {
  it('preserves supported allocation statuses', () => {
    expect(normalizeManagerSeatsAllocationStatus('Active')).toBe('Active');
    expect(normalizeManagerSeatsAllocationStatus('Expired')).toBe('Expired');
    expect(normalizeManagerSeatsAllocationStatus('Suspended')).toBe('Suspended');
  });

  it('does not represent unknown API values as Active', () => {
    expect(normalizeManagerSeatsAllocationStatus('PendingReview')).toBe('unknown');
    expect(normalizeManagerSeatsAllocationStatus(undefined)).toBe('unknown');
  });
});
