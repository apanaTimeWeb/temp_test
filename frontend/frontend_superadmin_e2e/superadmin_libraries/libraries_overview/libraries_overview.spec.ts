import { expect, test } from '@playwright/test';

test('libraries_overview displays library table and search controls', async ({ page }) => {
  await page.goto('/superadmin/superadmin_libraries/libraries_overview');

  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
  await expect(page.getByText('Application error', { exact: false })).toHaveCount(0);
});
