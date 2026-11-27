import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('seats_management E2E', () => {
  test('loads Seats Management page cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_seats_shifts_lockers/seats_management', { checkSearchInput: true });
  });
});
