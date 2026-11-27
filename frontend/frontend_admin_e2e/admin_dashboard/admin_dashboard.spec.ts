import { expect, test } from '@playwright/test';
test('loads admin_dashboard default overview via rewrite', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');
  await expect(page).toHaveURL(/\/admin\/admin_dashboard(?:\/dashboard_overview)?(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads dashboard_overview', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_overview');
  await expect(page).toHaveURL(/\/admin\/admin_dashboard\/dashboard_overview(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads dashboard_reports', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_reports');
  await expect(page).toHaveURL(/\/admin\/admin_dashboard\/dashboard_reports(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
