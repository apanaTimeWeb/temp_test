import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('loads the canonical shifts_management submodule route', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/shifts_management');
  await expect(page).toHaveURL(new RegExp('\\/admin\\/admin_seats_shifts_lockers\\/shifts_management(?:[?#]|$)'));
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('demo shifts_management CSV export downloads a file', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_seats_shifts_lockers/shifts_management');
  await expect(page.getByRole('heading', { name: /shifts/i }).first()).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('admin_shifts-page-control-002').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^admin-shifts-\d{4}-\d{2}-\d{2}\.csv$/);
});
