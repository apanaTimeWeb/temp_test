import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('redirects admin_dashboard to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');
  await expect(page).toHaveURL(/\/admin\/admin_dashboard\/dashboard_overview(?:[?#]|$)/);
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
