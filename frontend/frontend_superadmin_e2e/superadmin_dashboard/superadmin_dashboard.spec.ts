import { expect, test } from '@playwright/test';

test('loads superadmin_dashboard default overview via rewrite', async ({ page }) => {
  await page.goto('/superadmin/superadmin_dashboard');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_dashboard(?:\/dashboard_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads dashboard_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_dashboard/dashboard_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_dashboard\/dashboard_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
