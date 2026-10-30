import { afterEach, describe, expect, it } from 'vitest';
import { mswTestServer } from '@/app/frontend_admin/test/mswServer';
import { ADMIN_LOCKERS_MATRIX_MSW_HANDLERS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/mocks/AdminLockersMatrixMSWHandlers';
import { ADMIN_LOCKERS_URLS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/config/admin_lockers_matrix_lockers_url_config_source_routes';

describe('admin lockers matrix mock contract', () => {
  afterEach(() => mswTestServer.resetHandlers());

  it('serves the source-supported empty list without inventing matrix entities', async () => {
    mswTestServer.use(...ADMIN_LOCKERS_MATRIX_MSW_HANDLERS);
    const response = await fetch(`http://localhost${ADMIN_LOCKERS_URLS.SEAT_MATRIX}`);
    const payload = await response.json();
    expect(payload).toMatchObject({ success: true, data: [], requestId: 'mock-lockers-matrix-seat-matrix' });
  });
});
