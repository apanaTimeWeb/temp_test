import { expect, test } from '@playwright/test';

test('redirects superadmin_usage to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_usage');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_usage(?:\/usage_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads usage_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_usage/usage_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_usage\/usage_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads usage_quota_requests', async ({ page }) => {
  await page.goto('/superadmin/superadmin_usage/usage_quota_requests');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_usage\/usage_quota_requests(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
