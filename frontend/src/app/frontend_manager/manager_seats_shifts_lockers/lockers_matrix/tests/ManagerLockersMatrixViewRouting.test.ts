import { parseManagerLockerMatrixView } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixMainTypes';

describe('lockers_matrix route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerLockerMatrixView('locker_matrix')).toBe('locker_matrix');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'locker_matrix');
    for (const key of siblingViewKeys) {
      expect(parseManagerLockerMatrixView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerLockerMatrixView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerLockerMatrixView(undefined)).toBeUndefined();
  });
});
