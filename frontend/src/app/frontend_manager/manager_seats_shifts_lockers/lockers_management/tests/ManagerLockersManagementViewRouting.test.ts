import { parseManagerLockersView } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementMainTypes';

describe('lockers_management route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerLockersView('lockers')).toBe('lockers');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'lockers');
    for (const key of siblingViewKeys) {
      expect(parseManagerLockersView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerLockersView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerLockersView(undefined)).toBeUndefined();
  });
});
