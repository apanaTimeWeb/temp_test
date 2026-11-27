import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('staff_attendance E2E', () => {
  test('loads Staff Attendance & Shifts page and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_staff/staff_attendance', { checkSearchInput: true });
  });
});
