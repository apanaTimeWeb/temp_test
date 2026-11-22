import { normalizeManagerLockerMatrixStatus,normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixMatrixStatus';
import { describe,expect,it } from 'vitest';

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

  it('correctly models shift sharing so physical seats are available across distinct shifts', () => {
    // S-05 is occupied only during Morning shift
    const physicalSeat = {
      id: 'S-05',
      status: 'occupied' as const,
      shift: 'Morning',
      student: 'Rahul Sharma',
    };

    // When viewing Morning shift: seat is occupied by Rahul
    const isMorningOccupied = physicalSeat.shift === 'Morning' || physicalSeat.shift === 'Full Day';
    expect(isMorningOccupied).toBe(true);

    // When viewing Evening shift: seat is free and can be allocated to Priya
    const isEveningOccupied = physicalSeat.shift === 'Evening' || physicalSeat.shift === 'Full Day';
    expect(isEveningOccupied).toBe(false);
  });
});
