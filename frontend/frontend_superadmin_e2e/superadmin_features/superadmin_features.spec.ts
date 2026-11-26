import { expect, test } from '@playwright/test';

test('redirects superadmin_features to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_features');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_features(?:\/features_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads features_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_features/features_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_features\/features_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
