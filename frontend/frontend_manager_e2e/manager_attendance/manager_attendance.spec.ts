import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_attendance domain E2E', () => {
  test('attendance_daily switches to floor turnover queue and links deep into member monthly history', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_attendance/attendance_daily',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    await expect(page.getByTestId('manager-engagement-attendance-save')).toBeVisible();
    const turnoverTab = page.getByRole('button', { name: /Turnover/i });
    await expect(turnoverTab).toBeVisible();
    await turnoverTab.click();
    await expect(page.getByText(/Rahul Sharma/i).first()).toBeVisible();

    await page.getByRole('button', { name: /Roster/i }).first().click();
    const historyLink = page
      .getByTestId('manager-main-content')
      .getByRole('link', { name: /Monthly History/i })
      .first();
    await expect(historyLink).toBeVisible();
    await historyLink.click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_attendance\/attendance_monthly_history/);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Day 1', { exact: true })).toBeVisible();
  });

  test('attendance_monthly_history filters by shift, opens member calendar modal, and toggles punch log', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_attendance/attendance_monthly_history',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    await page.getByRole('button', { name: 'Night', exact: true }).click();
    await expect(page.getByText('Vikram Malhotra')).toBeVisible();
    await expect(page.getByText('Rahul Sharma')).toHaveCount(0);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.getByText('Rahul Sharma')).toBeVisible();

    await page.getByRole('button', { name: 'View Calendar' }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Day 1', { exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: /Punch Ledger Log/i }).click();
    await expect(dialog.locator('table')).toBeVisible();
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(dialog).toBeHidden();
  });

  test('attendance_absentee_report filters rows by shift & threshold and restores all absentees on reset', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_attendance/attendance_absentee_report',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(5);
    await expect(main.getByText('Priya Verma')).toBeVisible();
    await expect(main.getByText('Deepak Mishra')).toBeVisible();

    await main.getByRole('button', { name: 'Afternoon', exact: true }).click();
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('Priya Verma')).toHaveCount(0);
    await expect(main.getByText('Deepak Mishra')).toBeVisible();

    const threshold = page.locator('#absentee-threshold-select');
    await threshold.selectOption('7');
    await expect(threshold).toHaveValue('7');

    await main.getByRole('button', { name: /Reset Filters/i }).click();
    await expect(threshold).toHaveValue('3');
    await expect(rows).toHaveCount(5);
    await expect(main.getByText('Priya Verma')).toBeVisible();
  });

  test('attendance_qr_scanner shows contract boundary notice and verifies manual check-in entry', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_attendance/attendance_qr_scanner',
      { checkNoHorizontalOverflow: true },
    );

    await expect(page.getByTestId('manager-engagement-qr-camera-unavailable')).toBeVisible();
    const manualInput = page.locator('#manual-scan-input');
    await expect(manualInput).toBeVisible();
    await manualInput.fill('LIB-001');
    await page.getByRole('button', { name: 'Verify Check-In', exact: true }).click();
    await expect(page.getByText(/Rahul Sharma/i).first()).toBeVisible();
  });
});
