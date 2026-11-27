import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test('loads shifts_management, switches status filters, and opens Add Shift dialog', async ({ page }) => {
  await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_seats_shifts_lockers/shifts_management', { checkSearchInput: true });

  const main = page.getByRole('main');
  await main.getByRole('button', { name: 'Active', exact: true }).click();
  await main.getByRole('button', { name: 'Inactive', exact: true }).click();
  await main.getByRole('button', { name: 'All Shifts', exact: true }).click();

  await page.getByTestId('admin_shifts-page-control-add-shift').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
});

test('demo shifts_management CSV export downloads a file', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE === 'live', 'Skipped in strict live-only mode; runs by default when NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_seats_shifts_lockers/shifts_management');
  await expect(page.getByRole('heading', { name: /shifts/i }).first()).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('admin_shifts-page-control-002').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^admin-shifts-\d{4}-\d{2}-\d{2}\.csv$/);
});
