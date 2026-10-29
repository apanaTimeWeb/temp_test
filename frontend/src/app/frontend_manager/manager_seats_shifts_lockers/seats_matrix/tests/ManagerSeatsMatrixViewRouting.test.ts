import { parseManagerSeatMatrixView } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixMainTypes';

describe('seats_matrix route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerSeatMatrixView('seat_matrix')).toBe('seat_matrix');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'seat_matrix');
    for (const key of siblingViewKeys) {
      expect(parseManagerSeatMatrixView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerSeatMatrixView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerSeatMatrixView(undefined)).toBeUndefined();
  });
});
