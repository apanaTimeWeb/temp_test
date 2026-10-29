import { parseManagerSeatsView } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementMainTypes';
import { MANAGER_SEATS_MANAGEMENT_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/config/manager_seats_management.url_config';

describe('seats_management route view isolation', () => {
  it('accepts only the view key owned by this route', () => {
    expect(parseManagerSeatsView('seat_management')).toBe('seat_management');
    expect(parseManagerSeatsView('seat_maintenance')).toBe('seat_maintenance');
  });

  it('rejects sibling route view keys instead of switching workflows in-place', () => {
    const siblingViewKeys = ['allocations', 'locker_matrix', 'lockers', 'seat_history', 'seat_matrix', 'shift_gap', 'shift_management', 'shift_migration'];
    for (const key of siblingViewKeys) {
      expect(parseManagerSeatsView(key)).toBe('__invalid_view__');
    }
  });

  it('rejects unknown values and preserves the absent default', () => {
    expect(parseManagerSeatsView('unexpected-view')).toBe('__invalid_view__');
    expect(parseManagerSeatsView(undefined)).toBeUndefined();
  });
});


describe('seat maintenance detail view contract', () => {
  it('keeps the selected seat in a valid same-workflow URL', () => {
    expect(MANAGER_SEATS_MANAGEMENT_ROUTES.seatMaintenance('A 01')).toBe('/frontend_manager/manager_seats_shifts_lockers/seats_management?view=seat_maintenance&seat=A+01');
  });
});
