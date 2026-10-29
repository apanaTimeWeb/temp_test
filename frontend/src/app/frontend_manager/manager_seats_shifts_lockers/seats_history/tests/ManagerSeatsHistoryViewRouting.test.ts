import { parseManagerSeatHistoryView } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryMainTypes';

describe('seats_history route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerSeatHistoryView('seat_history')).toBe('seat_history');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_maintenance', 'seat_management', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'].filter((key) => key !== 'seat_history');
    for (const key of siblingViewKeys) {
      expect(parseManagerSeatHistoryView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerSeatHistoryView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerSeatHistoryView(undefined)).toBeUndefined();
  });
});
