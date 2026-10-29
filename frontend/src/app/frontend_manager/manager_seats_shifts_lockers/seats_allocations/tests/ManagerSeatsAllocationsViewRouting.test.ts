import { parseManagerAllocationsView } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsMainTypes';

describe('seats_allocations route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerAllocationsView('allocations')).toBe('allocations');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'allocations');
    for (const key of siblingViewKeys) {
      expect(parseManagerAllocationsView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerAllocationsView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerAllocationsView(undefined)).toBeUndefined();
  });
});
