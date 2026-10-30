import { describe, expect, it } from 'vitest';
import { ADMIN_LOCKERS_ROOT, ADMIN_LOCKERS_ROUTE_LOCKERS, ADMIN_LOCKERS_ROUTE_MATRIX, ADMIN_LOCKERS_API_LOCKERS, ADMIN_LOCKERS_API_SEAT_MATRIX, ADMIN_LOCKERS_URLS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/config/admin_lockers_management_lockers_url_config_source_routes';

describe('admin_lockers canonical URL contract', () => {
  it('exports a stable route owned by this module', () => {
    expect(ADMIN_LOCKERS_ROOT).toBe('/admin/admin_seats_shifts_lockers/lockers_management');
  });

  it('exposes direct refreshable URLs for both independently dispatched locker views', () => {
    expect(ADMIN_LOCKERS_ROUTE_LOCKERS).toBe('/admin/admin_seats_shifts_lockers/lockers_management');
    expect(ADMIN_LOCKERS_ROUTE_MATRIX).toBe('/admin/admin_seats_shifts_lockers/lockers_matrix');
  });

  it('preserves existing API URL keys and values for current consumers', () => {
    expect(ADMIN_LOCKERS_URLS.LOCKERS).toBe(ADMIN_LOCKERS_API_LOCKERS);
    expect(ADMIN_LOCKERS_URLS.SEAT_MATRIX).toBe(ADMIN_LOCKERS_API_SEAT_MATRIX);
    expect(ADMIN_LOCKERS_API_LOCKERS).toBe('/seats_shifts_lockers/lockers');
    expect(ADMIN_LOCKERS_API_SEAT_MATRIX).toBe('/seats_shifts_lockers/seat-matrix');
  });
});
