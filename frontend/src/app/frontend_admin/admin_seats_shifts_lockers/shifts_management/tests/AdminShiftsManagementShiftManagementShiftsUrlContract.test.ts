import { describe, expect, it } from 'vitest';
import { ADMIN_SHIFTS_ROOT, ADMIN_SHIFTS_ROUTE_SHIFT_MANAGEMENT } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/config/admin_shifts_management_shifts_url_config_source_routes';

describe('admin_shifts canonical URL contract', () => {
  it('exports a stable route owned by this module', () => {
    expect(ADMIN_SHIFTS_ROOT).toBe('/admin/admin_seats_shifts_lockers/shifts_management');
  });

  it('preserves a direct, refreshable URL for shift management', () => {
    expect(ADMIN_SHIFTS_ROUTE_SHIFT_MANAGEMENT).toBe('/admin/admin_seats_shifts_lockers/shifts_management');
  });
});
