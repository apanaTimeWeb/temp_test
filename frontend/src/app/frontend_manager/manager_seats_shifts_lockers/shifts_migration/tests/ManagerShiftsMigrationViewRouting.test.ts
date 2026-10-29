import { parseManagerShiftMigrationView } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationMainTypes';

describe('shifts_migration route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerShiftMigrationView('shift_migration')).toBe('shift_migration');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'shift_migration');
    for (const key of siblingViewKeys) {
      expect(parseManagerShiftMigrationView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerShiftMigrationView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerShiftMigrationView(undefined)).toBeUndefined();
  });
});
