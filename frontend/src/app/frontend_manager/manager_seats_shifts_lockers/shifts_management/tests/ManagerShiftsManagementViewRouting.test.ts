import { parseManagerShiftsView } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/types/ManagerShiftsManagementMainTypes';

describe('shifts_management route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerShiftsView('shift_management')).toBe('shift_management');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'shift_management');
    for (const key of siblingViewKeys) {
      expect(parseManagerShiftsView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerShiftsView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerShiftsView(undefined)).toBeUndefined();
  });
});
