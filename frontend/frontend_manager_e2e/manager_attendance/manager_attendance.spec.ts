import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_attendance domain E2E', () => {
  for (const route of [
    '/frontend_manager/manager_attendance/attendance_daily',
    '/frontend_manager/manager_attendance/attendance_absentee_report',
    '/frontend_manager/manager_attendance/attendance_qr_scanner',
  ]) {
    test(`loads ${route} cleanly without runtime errors`, async ({ page }) => {
      await expectCanonicalManagerSubmoduleLoaded(page, route, {
        checkSearchInput: true,
        checkNoHorizontalOverflow: true,
      });
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }
});
