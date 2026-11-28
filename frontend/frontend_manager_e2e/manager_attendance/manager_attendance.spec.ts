import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_attendance domain E2E', () => {
  for (const route of [
    '/frontend_manager/manager_attendance/attendance_daily',
    '/frontend_manager/manager_attendance/attendance_monthly_history',
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

  test('attendance_monthly_history filters by shift and opens member calendar modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_attendance/attendance_monthly_history',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    await page.getByRole('button', { name: 'Night' }).click();
    await expect(page.getByText('Vikram Malhotra')).toBeVisible();
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByRole('button', { name: 'View Calendar' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Day 1', { exact: true })).toBeVisible();
  });
});
