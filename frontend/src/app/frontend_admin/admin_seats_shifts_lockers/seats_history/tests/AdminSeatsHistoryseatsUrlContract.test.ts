import { describe, expect, it } from 'vitest';
import { ADMIN_SEATS_ROOT, ADMIN_SEATS_ROUTE_SEAT_MANAGEMENT } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/config/admin_seats_history_seats_url_config_source_routes';

describe('admin_seats canonical URL contract', () => {
  it('exports a stable route owned by this module', () => {
    expect(ADMIN_SEATS_ROOT).toBe('/admin/admin_seats_shifts_lockers/seats_management');
  });

  it('preserves a direct, refreshable URL for seat management', () => {
    expect(ADMIN_SEATS_ROUTE_SEAT_MANAGEMENT).toBe('/admin/admin_seats_shifts_lockers/seats_management');
  });
});
