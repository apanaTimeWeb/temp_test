import { expect, test } from '@playwright/test';

test('redirects superadmin_analytics to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics(?:\/analytics_platform_reports)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads analytics_platform_reports', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics/analytics_platform_reports');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics\/analytics_platform_reports(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads analytics_billing_reports', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics/analytics_billing_reports');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics\/analytics_billing_reports(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads analytics_usage_reports', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics/analytics_usage_reports');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics\/analytics_usage_reports(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads analytics_security_reports', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics/analytics_security_reports');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics\/analytics_security_reports(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('legacy route redirects analytics_financials to analytics_billing_reports', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics/analytics_financials');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics\/analytics_billing_reports(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('legacy route redirects analytics_overview to analytics_platform_reports', async ({ page }) => {
  await page.goto('/superadmin/superadmin_analytics/analytics_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_analytics\/analytics_platform_reports(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});
