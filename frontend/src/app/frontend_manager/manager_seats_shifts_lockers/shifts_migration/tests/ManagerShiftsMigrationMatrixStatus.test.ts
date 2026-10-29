import { describe, expect, it } from 'vitest';
import { normalizeManagerLockerMatrixStatus, normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/utils/ManagerShiftsMigrationMatrixStatus';

describe('matrix status normalization', () => {
  it('recognizes explicit statuses and flags', () => {
    expect(normalizeManagerSeatMatrixStatus('occupied')).toBe('occupied');
    expect(normalizeManagerSeatMatrixStatus(undefined, { isActive: true })).toBe('free');
    expect(normalizeManagerSeatMatrixStatus('expiring')).toBe('expiring');
    expect(normalizeManagerLockerMatrixStatus('maintenance')).toBe('maintenance');
    expect(normalizeManagerLockerMatrixStatus(undefined, { isOccupied: true })).toBe('occupied');
  });

  it('keeps absent and unrecognized statuses unknown instead of inventing maintenance', () => {
    expect(normalizeManagerSeatMatrixStatus(undefined)).toBe('unknown');
    expect(normalizeManagerSeatMatrixStatus('reserved-pending')).toBe('unknown');
    expect(normalizeManagerLockerMatrixStatus(null)).toBe('unknown');
    expect(normalizeManagerLockerMatrixStatus('reserved-pending')).toBe('unknown');
  });
});
